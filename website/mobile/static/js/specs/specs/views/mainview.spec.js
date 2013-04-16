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
});
