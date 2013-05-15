describe('RoutesView', function() {
    var datamgr;
    var app;
    var routesView;

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
        routesView = new TripAssist.RoutesView(datamgr, app);
    });

    it('test routes listed', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            routesView.render(ctn, null, function() {
                expect( $('#test-ctn .sublist').length ).to.be(1);
                expect( $('#test-ctn ul .label').text() ).to.be('Bus 74');
                done();
            });    
        });
    });

    it('test navigate to route', function(done) {
       datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            routesView.render(ctn, null, function() {
                $('.navigate-btn').trigger('tap');
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
