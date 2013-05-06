// override navigator.geolocation
navigator.geolocation.watchPosition = function(callback, errorHandler, options) {
    callback({ // main square, directly south of clock tower
        coords: {
            latitude: 47.071466,
            longitude: 15.437272
        }
    });
};

// override window.addEventListener
var deviceorientationCallback = null;
window.addEventListener = function(name, callback, b) {
    if (name == 'deviceorientation') {
        deviceorientationCallback = callback;
    }
};

(function ($) {
    $.fn.rotationDegrees = function () {
         var matrix = this.css("-webkit-transform") ||
    this.css("-moz-transform")    ||
    this.css("-ms-transform")     ||
    this.css("-o-transform")      ||
    this.css("transform");
    if(typeof matrix === 'string' && matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return angle;
   };
}(jQuery));

describe('NavigationView', function() {
    var datamgr;
    var app;
    var navView;

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager(user);
        app = new TripAssist.Application();
        navView = new TripAssist.NavigationView(datamgr, app);
    });

    function getTargetLoc() {
        return {
            "name": "Graz Clocktower",
            "latitude": 47.074258,
            "longitude": 15.437272,
            "due": new Date() // should display "now" accordingly
        };
    }

    it('test title', function(done) {
        var ctn = document.getElementById('test-ctn');
        navView.render(ctn, getTargetLoc(), function() {
            expect( navView.title() ).to.be('Graz Clocktower');
            ctn.innerHTML = '';
            done();
        });
    });

    it('test info distance', function(done) {
        var ctn = document.getElementById('test-ctn');
        navView.render(ctn, getTargetLoc(), function() {
            // wait until events are fired
            window.setTimeout(function() {
                var dist = $('#right-info-ctn p:first').text();
                expect( dist ).to.be('310m');
                ctn.innerHTML = '';
                done();
            }, 50);
        });
    });

    it('test info direction', function(done) {
        var ctn = document.getElementById('test-ctn');
        navView.render(ctn, getTargetLoc(), function() {
            // wait until events are fired
            window.setTimeout(function() {
                var dist = $('#right-info-ctn p:last').text();
                expect( dist ).to.be('N');
                ctn.innerHTML = '';
                done();
            }, 50);
        });
    });

    it('test arrow direction', function(done) {
        var ctn = document.getElementById('test-ctn');
        navView.render(ctn, getTargetLoc(), function() {
            // wait until events are fired
            window.setTimeout(function() {
                deviceorientationCallback({
                    alpha: 35.0
                });
                var angle = $('#arrow-ctn').rotationDegrees();
                expect( angle ).to.be(35);
                ctn.innerHTML = '';
                done();
            }, 50);
        });
    });

    it('test due time', function(done) {
        var ctn = document.getElementById('test-ctn');
        navView.render(ctn, getTargetLoc(), function() {
            // wait until events are fired
            window.setTimeout(function() {
                var due = $('#left-info-ctn').text();
                expect( due ).to.be('Now');
                ctn.innerHTML = '';
                done();
            }, 50);
        });
    });
});
