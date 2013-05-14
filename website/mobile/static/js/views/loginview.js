var TripAssist;
(function (TripAssist) {
    var LoginView = (function () {
        function LoginView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('loginview.template'));
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        LoginView.prototype.title = function () {
            return 'Login';
        };
        LoginView.prototype.name = function () {
            return "LoginView";
        };
        LoginView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
            });
            this.addEvents();
            $('#settings-btn').hide();
            callback();
        };
        LoginView.prototype.store = function () {
            this.stored = true;
            $('#settings-btn').show();
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        LoginView.prototype.restore = function (ctn) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            $('#settings-btn').hide();
            this.addEvents();
        };
        LoginView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            $('#settings-btn').show();
        };
        LoginView.prototype.addEvents = function () {
            var self = this;
            $('#login-btn').on('tap', function () {
                self.datamgr.login($('#username-input').val(), $('#password-input').val(), function (success, errorMsg) {
                    if(!success) {
                        $('#info-ctn').html(errorMsg);
                        $('#info-ctn').show();
                        window.setTimeout(function () {
                            $('#info-ctn').hide();
                        }, 2000);
                    } else {
                        self.app.settingsDone();
                    }
                });
                return false;
            });
        };
        return LoginView;
    })();
    TripAssist.LoginView = LoginView;    
})(TripAssist || (TripAssist = {}));
