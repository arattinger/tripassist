describe('RouteDetailView', function() {
    var app = null;
    var datamgr = null;
    var detailView = null;

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
        detailView = new TripAssist.RouteDetailView(datamgr, app);
    });

    it('test data', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getRoute(1), function() {
                expect( $('.detail-info-ctn').get(0).innerHTML ).to.be('Apr 23<sup>rd</sup>, 17:27 at Main Station');
                expect( $('.detail-info-ctn').get(1).innerHTML ).to.be('Apr 24<sup>th</sup>, 21:15 at Railway station');
                expect( $('.detail-info-ctn').get(2).innerHTML ).to.be('27 h 48 min, 76.0 km');
                expect( $('.label').get(0).innerHTML ).to.be('Bus_ticket.pdf');
                done();
            });    
        });
    });

    it('test navigation', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getRoute(1), function() {
                $('#navigate-btn').trigger('tap');
                expect( app.loadedName ).to.be('NavigationView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.name ).to.be('Bus 74');
                expect( app.loadedData.longitude ).to.be(15.437272);
                expect( app.loadedData.latitude ).to.be(47.074258);
                expect( app.loadedData.due.getTime() ) .to.be(1366730839549);
                done();
            });    
        });
    });
});
