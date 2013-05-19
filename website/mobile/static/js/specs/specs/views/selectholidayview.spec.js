describe('SelectHolidayView', function() {
    var datamgr;
    var app;

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager();
        datamgr.login('test', 'emptypwd', null);
        app = new TripAssist.Application();
    });

    function createHoliday(id) {
        var holiday = {
            id: id,
            name: "MyHoliday",
            created: new Date(),
            last_changed: new Date(),
            start: new Date()-1000,
            end: new Date()+10000
        };
        return holiday;
    }

    /*it ('offline holiday list empty', function() {
        var offline_holidays = datamgr.getOfflineHolidays();
        // remove all offline holidays
        for(var i = 0; i<offline_holidays.length; i++)
            datamgr.removeDownloadedHoliday(offline_holidays[i].id);

        app.loadView('SelectHolidayView');

        expect( $('.empty-list').length ).to.be.greaterThan(0);
        expect( $('.empty-list')[0].innerHTML ).to.be('No holiday is currently stored offline.');

    });*/

    it('offline holiday list multiple items', function(done) {
        app.loadView('SelectHolidayView');
        window.setTimeout(function() {

            expect( $('#main-ctn ul').length ).to.be.greaterThan(0);
            expect( $('#main-ctn ul:first').children('li').length ).to.be(1);
            expect( $('#main-ctn ul:first').children('li').children()[0].innerHTML ).to.be('Dummy Holiday');
            done();
        }, 100);
    });
});
