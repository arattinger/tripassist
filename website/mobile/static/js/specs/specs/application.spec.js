// disable history (prevents unit testing)
history.pushState = null;

describe('Application', function() {
    var app;
    var datamgr = new TripAssist.DataManager();
    datamgr.login('test', 'emptypwd'); // required not to load the login view

    beforeEach(function() {
        $('#main-ctn').html('');
        app = new TripAssist.Application();
    });

    it('back button works', function(done) {
        app.start();
        window.setTimeout(function() {
            app.loadView('MainView', { name: 'MyHoliday' });
        }, 10);

        window.setTimeout(function() {
            expect ( $('#title').text() ).to.be('MyHoliday');
            $('#back-btn').trigger('tap');
        }, 30);
            
        window.setTimeout(function() {
            expect ( $('#title').text() ).not.to.be('MyHoliday');
            done();    
        }, 60);        
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

    it('test settings done as settings', function(done) {
        app.start();
        app.loadView('MainView', { name: 'MyHoliday' });
        window.setTimeout(function() {
            app.loadView('LoginView', null );
        }, 10);

        window.setTimeout(function() {
            app.settingsDone();
            expect( $('#title').text() ).to.be('Select Holiday');
            expect( $('#back-btn').css('display') ).to.be('none');
            done();
        }, 20);
    });

    it('test settings done as login', function(done) {
        app.start();

        window.setTimeout(function() {
            app.settingsDone();
            expect( $('#title').text() ).to.be('Select Holiday');
            expect( $('#back-btn').css('display') ).to.be('none');
            done();
        }, 20);
    });
});
