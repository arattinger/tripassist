$.mobile.loadingMessage = false;
$(document).ready(function() {

    // define all classes to be fetched from server
    var CLASSES = [
        'application',
        'datamgr',
        'utils',
        'views/mainview',
        'views/routesview',
        'views/selectholidayview'
    ];

    // define all templates to be fetched from server
    var TEMPLATES = [
        'main',
        'mainview',
        'routesview',
        'selectholidayview',
        'selectholidayview-list'
    ];

    var loadClassCounter = 0;
    var loadTemplatesCounter = 0;

    function callback() {
        if (loadClassCounter == CLASSES.length && loadTemplatesCounter == TEMPLATES.length) {

            // add dummy holiday for interactive tests
            // TODO: remove
            var dummy = [{
                id: 1,
                name: "Dummy Holiday",
                created: 1224043400000,
                last_changed: 1224043400000,
                start: 1224043400000,
                end: 1224047400000
            }];
            localStorage["offlineHolidays"] = JSON.stringify(dummy);

            // create application and start it
            var app = new TripAssist.Application();
            app.start();
        }
    }

    // load them and start application when done
    for (var i = 0; i<CLASSES.length; i++) {
        $.getScript('/static/js/' + CLASSES[i] + '.js').done(function() {
            loadClassCounter++;
            callback();
        }).fail(function(jqxhr, settings, exception) {
            console.log(exception);
        })
    }

    for (var i = 0; i<TEMPLATES.length; i++) {
        $.get('/static/js/templates/' + TEMPLATES[i] + '.template', null, null, 'html').done(function(template, textStatus, jqxhr) {
            loadTemplatesCounter++;

            var names = this.url.split('/');
            TemplateManager.addTemplate(names[names.length-1], template);

            callback();

        }).fail(function(jqxhr, settings, exception) {
            console.log(exception);
        })
    }
});