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
        private storedTitle: string;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('mainview.template'));
            this.storedTitle = 'Main View';
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }

        public title() {
            return this.storedTitle;
        }

        public name() {
            return "MainView";
        }

        public render(ctn: HTMLElement, data: TripAssist.Holiday, callback: () => any) {
            this.currentCtn = ctn;
            this.storedTitle = data.name;
            ctn.innerHTML = this.mainTemplate({
            });

            callback();
        }

        public store() {
        this.stored = true;
        if (this.currentCtn)
            this.storedHTML = this.currentCtn.innerHTML;
        }

        public restore(ctn: HTMLElement) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        }

    }
}