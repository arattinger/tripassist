/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />

module TripAssist {
    export class MainView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private title_: string;
        private app: TripAssist.Application;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('mainview.template'));
            this.title_ = 'Main View';
        }

        public title() {
            return this.title_;
        }

        public name() {
            return "MainView";
        }

        public render(ctn: HTMLElement, data: TripAssist.Holiday, callback: () => any) {
            this.title_ = data.name;
            ctn.innerHTML = this.mainTemplate({
            });
        }

    }
}