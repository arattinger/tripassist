describe('AccommodationsView', function() {
    var datamgr;
    var app;
    var accommodationsView;

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
        accommodationsView = new TripAssist.AccommodationsView(datamgr, app);
    });

    it('test accommodations listed', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            accommodationsView.render(ctn, null, function() {
                expect( $('#test-ctn .sublist').length ).to.be(2);
                expect( $('#test-ctn ul:first .label').text() ).to.be("Hotel d'Amour");
                done();
            });    
        });
    });

    it('test navigate to first accomodation', function(done) {
       datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            accommodationsView.render(ctn, null, function() {
                $('.navigate-btn:first').trigger('tap');
                expect( app.loadedName ).to.be('NavigationView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.name ).to.be("Hotel d'Amour");
                expect( app.loadedData.longitude ).to.be(47.13);
                expect( app.loadedData.latitude ).to.be(16.45);
                done();
            });    
        }); 
    });
});
