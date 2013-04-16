$(document).ready(function() {

    // define all classes to be fetched from server
    var CLASSES = [
        'application',
        'views/selectholidayview'
    ];

    // define all templates to be fetched from server
    var TEMPLATES = [
        'main',
        'selectholidayview'
    ];

    var loadClassCounter = 0;
    var loadTemplatesCounter = 0;

    function callback() {
        if (loadClassCounter == CLASSES.length && loadTemplatesCounter == TEMPLATES.length) {

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