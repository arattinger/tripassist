$(document).ready(function() {

    // define all classes to be fetched from server
    var CLASSES = [
        'application',
        'views/selectholidayview'
    ];

    // load them and start application when done
    var loadClassCounter = 0;
    for (var i = 0; i<CLASSES.length; i++) {
        $.getScript('/static/js/' + CLASSES[i] + '.js').done(function() {
            loadClassCounter++;
            if (loadClassCounter == CLASSES.length) {

                // create application and start it
                var app = new TripAssist.Application();
                app.start();

            }
        }).fail(function(jqxhr, settings, exception) {
            console.log(exception);
        })
    }
});