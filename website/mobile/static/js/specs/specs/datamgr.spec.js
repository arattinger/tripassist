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
            last_changed: new Date(),
            accommodations: [],
            places: [],
            routes: []
        };
        return holiday;
    }

    it('retrieve empty offline holiday list', function() {
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

});
