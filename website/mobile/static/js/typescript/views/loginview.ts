/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />

module TripAssist {
    export class LoginView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private storedTitle: string;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('loginview.template'));
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }

        public title() {
            return 'Login';
        }

        public name() {
            return "LoginView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
            });
            this.addEvents();
            $('#settings-btn').hide();
            callback();
        }

        public store() {
        this.stored = true;
        $('#settings-btn').show();
        if (this.currentCtn)
            this.storedHTML = this.currentCtn.innerHTML;
        }

        public restore(ctn: HTMLElement) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            $('#settings-btn').hide();
            this.addEvents();
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            $('#settings-btn').show();
        }

        private addEvents() {
            var self = this;
            $('#login-btn').on('tap', function() {
                self.datamgr.login($('#username-input').val(), $('#password-input').val(), function(success, errorMsg) {
                    if (!success) {
                        $('#info-ctn').html(errorMsg);
                        $('#info-ctn').show();
                        window.setTimeout(function() {
                            $('#info-ctn').hide();
                        }, 2000);
                    } else {
                        self.app.settingsDone();
                    }
                });
                return false;
            });
        }

    }
}