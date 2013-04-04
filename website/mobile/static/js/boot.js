$(document).ready(function() {

    // define all classes to be fetched from server
    var CLASSES = [
        'application',
        'views/selectholidayview'
    ];

    // define all templates to be fetched from server
    var TEMPLATES = [
        'main'
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
            
            // TODO: replace with TypeScript template handler
            var script = document.createElement("script");
            script.type = "text/x-handlebars-template";
            script.id = names[names.length-1].replace(/\./, '-'); // dots are not allowed as id identifiers
            script.text = template;
            document.body.appendChild(script);

            callback();

        }).fail(function(jqxhr, settings, exception) {
            console.log(exception);
        })
    }
});