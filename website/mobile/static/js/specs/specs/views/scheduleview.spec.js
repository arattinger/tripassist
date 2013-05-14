describe('ScheduleView', function() {
    var datamgr;
    var app;
    var scheduleView;

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager();
        datamgr.login('test', 'emptypwd', null);
        app = {
            loadedName: null,
            loadedData: null,

            loadView: function(name, data) {
                this.loadedName = name;
                this.loadedData = data;
            }
        };
        scheduleView = new TripAssist.ScheduleView(datamgr, app);
    });

    it('test schedule listed', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            scheduleView.render(ctn, null, function() {
                expect( $('#test-ctn .sublist').length ).to.be(3);
                expect( $('#test-ctn ul:first .label').text() ).to.be("Bus 74");
                expect( $('#test-ctn ul:last .label').text() ).to.be("Hôtel du mar");
                done();
            });    
        });
    });

    it('test navigate to first route', function(done) {
       datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            scheduleView.render(ctn, null, function() {
                $('.navigate-btn:first').trigger('tap');
                expect( app.loadedName ).to.be('NavigationView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.name ).to.be("Bus 74");
                expect( app.loadedData.longitude ).to.be(15.437272);
                expect( app.loadedData.latitude ).to.be(47.074258);
                done();
            });    
        }); 
    });

    it('test navigate to last accommodation', function(done) {
       datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            scheduleView.render(ctn, null, function() {
                $('.navigate-btn:last').trigger('tap');
                expect( app.loadedName ).to.be('NavigationView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.name ).to.be("Hôtel du mar");
                expect( app.loadedData.longitude ).to.be(47.17);
                expect( app.loadedData.latitude ).to.be(16.42);
                done();
            });    
        }); 
    });

    it('test open first route', function(done) {
       datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            scheduleView.render(ctn, null, function() {
                $('#test-ctn ul:first .label').trigger('tap');
                expect( app.loadedName ).to.be('RouteDetailView');
                done();
            });    
        }); 
    });

    it('test open last accommodation', function(done) {
       datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            scheduleView.render(ctn, null, function() {
                $('#test-ctn ul:last .label').trigger('tap');
                expect( app.loadedName ).to.be('AccommodationDetailView');
                done();
            });    
        }); 
    });
});
