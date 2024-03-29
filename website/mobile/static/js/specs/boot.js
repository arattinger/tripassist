$(document).ready(function() {

    // define all classes to be fetched from server
    var CLASSES = [
        'application',
        'datamgr',
        'utils',
        'views/accommodationdetailview',
        'views/accommodationsview',
        'views/mainview',
        'views/loginview',
        'views/placesview',
        'views/placedetailview',
        'views/navigationview',
        'views/routedetailview',
        'views/routesview',
        'views/scheduleview',
        'views/selectholidayview',
        'views/svgview'
    ];

    // define all templates to be fetched from server
    var TEMPLATES = [
        'main',
        'accommodationdetailview',
        'accommodationsview',
        'loginview',
        'mainview',
        'navigationview',
        'placesview',
        'placedetailview',
        'routedetailview',
        'routesview',
        'scheduleview',
        'selectholidayview',
        'selectholidayview-list',
        'svgview',
        'waiting'
    ];

    var loadClassCounter = 0;
    var loadTemplatesCounter = 0;

    function callback() {
        if (loadClassCounter == CLASSES.length * 2 && loadTemplatesCounter == TEMPLATES.length) {

            mocha.run();
        }
    }

    // load them and start tests when done
    for (var i = 0; i<CLASSES.length; i++) {
        $.getScript('/static/js/' + CLASSES[i] + '.js').done(function() {
            loadClassCounter++;
            callback();
        }).fail(function(jqxhr, settings, exception) {
            console.log(exception);
        })
    }

    // load tests
    for (var i = 0; i<CLASSES.length; i++) {
        $.getScript('/static/js/specs/specs/' + CLASSES[i] + '.spec.js').done(function() {
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

    // setup mocha
    mocha.setup({
        ui: 'bdd',
        globals:["_", "$", "jQuery*", "navigator"]
    });
});
