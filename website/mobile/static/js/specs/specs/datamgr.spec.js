describe('DataManager', function() {

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
        expect ( DataManager.getOfflineHolidays().length ).to.be(0);
    });

    it('store single holiday offline', function() {
        var holiday = createHoliday(1);
        DataManager.addDownloadedHoliday(holiday);
        expect ( DataManager.getOfflineHolidays().length ).to.be(1);
        DataManager.removeDownloadedHoliday(1);
        expect ( DataManager.getOfflineHolidays().length ).to.be(0);
    });

    it('store multiple holidays offline', function() {
        var holiday1 = createHoliday(1);
        var holiday2 = createHoliday(2);
        DataManager.addDownloadedHoliday(holiday1);
        DataManager.addDownloadedHoliday(holiday2);
        expect ( DataManager.getOfflineHolidays().length ).to.be(2);
        DataManager.removeDownloadedHoliday(1);
        expect ( DataManager.getOfflineHolidays().length ).to.be(1);
        DataManager.removeDownloadedHoliday(2);
        expect ( DataManager.getOfflineHolidays().length ).to.be(0);
    });

});
