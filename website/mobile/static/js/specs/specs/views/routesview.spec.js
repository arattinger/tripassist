describe('RoutesView', function() {
    var datamgr;
    var app;
    var routesView;

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager(user);
        app = new TripAssist.Application();
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
});
