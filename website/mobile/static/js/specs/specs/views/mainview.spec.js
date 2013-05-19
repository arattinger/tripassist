describe('MainView', function() {
    var app;

    beforeEach(function() {
        app = new TripAssist.Application();
    });

    it('load routes view', function(done) {
        app.start();
        app.loadView('MainView', { name: 'MyHoliday' });
        window.setTimeout(function() {
            $('#route-tile').trigger('tap');
        }, 10);
        window.setTimeout(function() {
            expect ( $('#title').text() ).to.be('Routes');
            done();    
        }, 20);
    });

    it('load accommodations view', function(done) {
        app.start();
        app.loadView('MainView', { name: 'MyHoliday' });
        window.setTimeout(function() {
            $('#accomm-tile').trigger('tap');
        }, 10);
        window.setTimeout(function() {
            expect ( $('#title').text() ).to.be('Accommodations');
            done();    
        }, 20);
    });

    it('load places view', function(done) {
        app.start();
        app.loadView('MainView', { name: 'MyHoliday' });
        window.setTimeout(function() {
            $('#places-tile').trigger('tap');
        }, 10);
        window.setTimeout(function() {
            expect ( $('#title').text() ).to.be('Places');
            done();    
        }, 20);
    });

    it('load schedule view', function(done) {
        app.start();
        app.loadView('MainView', { name: 'MyHoliday' });
        window.setTimeout(function() {
            $('#schedule-tile').trigger('tap');
        }, 10);
        window.setTimeout(function() {
            expect ( $('#title').text() ).to.be('Schedule');
            done();    
        }, 20);
    });
});
