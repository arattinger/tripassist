describe('DataManager', function() {

    var datamgr;

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager(user);
    });

    function createHoliday(id) {
        var holiday = {
            id: id,
            name: "MyHoliday",
            created: new Date(),
            last_changed: new Date()
        };
        return holiday;
    }

    it('retrieve empty offline holiday list', function() {
        // remove all offline holidays
        localStorage["offlineHolidays"] = [];
        expect ( datamgr.getOfflineHolidays().length ).to.be(0);
    });

    it('store single holiday offline', function() {
        var holiday = createHoliday(1);
        datamgr.addDownloadedHoliday(holiday);
        expect ( datamgr.getOfflineHolidays().length ).to.be(1);
        datamgr.removeDownloadedHoliday(1);
        expect ( datamgr.getOfflineHolidays().length ).to.be(0);
    });

    it('store multiple holidays offline', function() {
        var holiday1 = createHoliday(1);
        var holiday2 = createHoliday(2);
        datamgr.addDownloadedHoliday(holiday1);
        datamgr.addDownloadedHoliday(holiday2);
        expect ( datamgr.getOfflineHolidays().length ).to.be(2);
        datamgr.removeDownloadedHoliday(1);
        expect ( datamgr.getOfflineHolidays().length ).to.be(1);
        datamgr.removeDownloadedHoliday(2);
        expect ( datamgr.getOfflineHolidays().length ).to.be(0);
    });

    it('retrieve single holiday', function() {
        var holiday1 = createHoliday(1);
        var holiday2 = createHoliday(2);
        datamgr.addDownloadedHoliday(holiday1);
        datamgr.addDownloadedHoliday(holiday2);
        expect ( datamgr.getOfflineHoliday(2).id ).to.be(2);

        expect ( datamgr.getOfflineHoliday(2).name ).to.be('MyHoliday');
        datamgr.removeDownloadedHoliday(1);
        datamgr.removeDownloadedHoliday(2);
    });

    it('retrieve routes list from routes_1.json file', function(done) {
        datamgr.loadHoliday(1, function() {
            var list = datamgr.getRoutesList();
            expect( list.length ).to.be(1);
            expect( list[0].name ).to.be('Bus 74');
            done();
        });
    });

    it('retrieve specific route after loading from server', function(done) {
        datamgr.loadHoliday(1, function() {
            var route = datamgr.getRoute(1);
            expect( route.id ).to.be(1);
            expect( route.name ).to.be('Bus 74');
            done();
        });
    });

    it('retrieve accommodations list from accommodations_1.json file', function(done) {
        datamgr.loadHoliday(1, function() {
            var list = datamgr.getAccommodationsList();
            expect( list.length ).to.be(2);
            expect( list[1].name ).to.be('Hôtel du mar');
            done();
        });
    });

    it('retrieve accommodation after loading from server', function(done) {
        datamgr.loadHoliday(1, function() {
            var acc = datamgr.getAccommodation(1);
            expect( acc.id ).to.be(1);
            expect( acc.name ).to.be("Hotel d'Amour");
            done();
        });
    });

    it('retrieve places list from places_1.json file', function(done) {
        datamgr.loadHoliday(1, function() {
            var list = datamgr.getPlacesList();
            expect( list.length ).to.be(1);
            expect( list[0].name ).to.be('Ristorante Milano');
            done();
        });
    });

    it('retrieve place from server', function(done) {
        datamgr.loadHoliday(1, function() {
            var place = datamgr.getPlace(3);
            expect( place.id ).to.be(3);
            expect( place.name ).to.be("Ristorante Milano");
            done();
        });
    });

    it('retrieve schedule', function(done) {
        datamgr.loadHoliday(1, function() {
            var schedule = datamgr.getSchedule();
            expect ( schedule.length ).to.be(3);
            // first element should be Bus 74
            expect ( schedule[0].name ).to.be('Bus 74');
            expect ( schedule[0].elemType ).to.be('route');
            // second element should be Hotel d'Amour
            expect ( schedule[1].name ).to.be("Hotel d'Amour");
            expect ( schedule[1].elemType ).to.be('accommodation');
            done();
        });
    });

});
