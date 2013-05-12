// override navigator.geolocation in navigationview.spec.js


describe('PlacesView', function() {
    var datamgr;
    var app;
    var placesView;

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager(user);
        app = {
            loadedName: null,
            loadedData: null,

            loadView: function(name, data) {
                this.loadedName = name;
                this.loadedData = data;
            }
        };
        placesView = new TripAssist.PlacesView(datamgr, app);
    });

    it('test waiting message shown', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            placesView.render(ctn, null, function() {
                expect( $('#waiting-msg').length ).to.be(1);
                done();
            });    
        });
    });

    it('test places listed', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            placesView.render(ctn, null, function() {
                window.setTimeout(function() {
                    expect( $('#test-ctn .sublist').length ).to.be(2);
                    expect( $('#test-ctn ul:first .label').text() ).to.be("Starcke Haus");
                    expect( $('#test-ctn ul:first .info-ctn').html() ).to.be('<p>N</p><p>468 m</p>');
                    done();
                }, 100);
            });    
        });
    });

    it('test navigate to first place', function(done) {
       datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            placesView.render(ctn, null, function() {
                $('.navigate-btn:first').trigger('tap');
                expect( app.loadedName ).to.be('NavigationView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.name ).to.be("Starcke Haus");
                expect( app.loadedData.longitude ).to.be(15.436113);
                expect( app.loadedData.latitude ).to.be(47.075602);
                done();
            });    
        }); 
    });
});
