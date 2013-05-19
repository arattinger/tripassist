describe('LoginView', function() {
    var datamgr;
    var app;
    var loginView;

    beforeEach(function() { 
        var user = {
            username: "test"
        };
        datamgr = {
            passwd: null,
            username: null,
            success: false,
            errormsg: '',
            login: function(username, passwd, callback) {
                this.passwd = passwd;
                this.username = username;
                callback(this.success, this.errormsg);
            }
        };
        app = {
            called: false,
            settingsDone: function() {
                this.called = true;
            }
        };
        loginView = new TripAssist.LoginView(datamgr, app);
    });

    it('test settings button hidden', function(done) {
        var ctn = document.getElementById('test-ctn');
        loginView.render(ctn, null, function() {
            expect( $('#settings-btn').css('display') ).to.be('none');
            expect( $('#info-ctn').css('display') ).to.be('none');
            done();
        });    
    });

    it('test correct login', function(done) {
        var ctn = document.getElementById('test-ctn');
        loginView.render(ctn, null, function() {
            $('#username-input').val('myuser');
            $('#password-input').val('password');
            datamgr.success = true;
            $('#login-btn').trigger('tap');
            expect( datamgr.username ).to.be('myuser');
            expect( datamgr.passwd ).to.be('password');
            expect( app.called ).to.be(true);
            done();
        });    
    });

    it('test incorrect login', function(done) {
        var ctn = document.getElementById('test-ctn');
        loginView.render(ctn, null, function() {
            $('#username-input').val('myuser');
            $('#password-input').val('password');
            datamgr.success = false;
            datamgr.errormsg = 'my error msg';
            $('#login-btn').trigger('tap');
            expect( datamgr.username ).to.be('myuser');
            expect( datamgr.passwd ).to.be('password');
            expect( $('#info-ctn').css('display') ).to.be('block');
            expect( $('#info-ctn').html() ).to.be('my error msg');
            expect( app.called ).to.be(false);
            done();
        });    
    });
});
