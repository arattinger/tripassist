describe('SelectHolidayView', function() {
    var datamgr;
    var app;

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager(user);
        app = new TripAssist.Application();
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

    it ('offline holiday list empty', function() {
        var offline_holidays = datamgr.getOfflineHolidays();
        // remove all offline holidays
        for(var i = 0; i<offline_holidays.length; i++)
            datamgr.removeDownloadedHoliday(offline_holidays[i].id);

        app.loadView('SelectHolidayView');

        expect( $('.empty-list').length ).to.be.greaterThan(0);
        expect( $('.empty-list')[0].innerHTML ).to.be('No holiday is currently stored offline.');

    });

    it('offline holiday list multiple items', function() {
        var offline_holidays = datamgr.getOfflineHolidays();
        // remove all offline holidays
        for(var i = 0; i<offline_holidays.length; i++)
            datamgr.removeDownloadedHoliday(offline_holidays[i].id);

        var holiday1 = createHoliday(1);
        var holiday2 = createHoliday(2);
        datamgr.addDownloadedHoliday(holiday1);
        datamgr.addDownloadedHoliday(holiday2);

        app.loadView('SelectHolidayView');

        expect( $('#main-ctn ul').length ).to.be.greaterThan(0);
        expect( $('#main-ctn ul:first').children('li').length ).to.be(offline_holidays.length);
        expect( $('#main-ctn ul:first').children('li')[0].innerHTML ).to.be(offline_holidays[0].name);

        datamgr.removeDownloadedHoliday(1);
        datamgr.removeDownloadedHoliday(2);
    });
});
