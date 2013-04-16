describe('Application', function() {
    var app;

    beforeEach(function() {
        app = new TripAssist.Application();
    });

    it('main container filled', function() {
        expect ( $('#main-ctn').html().length ).to.be(0);
        app.start();
        expect ( $('#main-ctn').html().length ).not.to.be(0);
    });

    it('selectholidayview loaded initially', function() {
        app.start();
        expect ( $('#title').text() ).to.be('Select Holiday');
    });

    it('loading a main view works too', function(done) {
        app.start();
        app.loadView('MainView', { name: 'MyHoliday' });
        window.setTimeout(function() {
            expect ( $('#title').text() ).to.be('MyHoliday');
            done();
        }, 10);
    });

    it('back button works', function(done) {
        app.start();
        app.loadView('MainView', { name: 'MyHoliday' });
        window.setTimeout(function() {
            $('#back-btn').trigger('tap');
        }, 10);
        window.setTimeout(function() {
            expect ( $('#title').text() ).to.be('Select Holiday');
            done();    
        }, 20);
        
    });

});
