/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />

module TripAssist {
    
    export interface SVGItem {
        title?: string;
        token?: string;
    }

    export class SVGView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;
        private title_: string;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('svgview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.title_ = 'Route';
        }

        public title() {
            return this.title_;
        }

        public name() {
            return "SVGView";
        }

        public render(ctn: HTMLElement, data: SVGItem, callback: () => any) {
            this.title_ = data.title;
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
                url: this.datamgr.getAttachmentUrl(data.token, '.svg')
            });

            this.addEvents();
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
            this.addEvents();
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        }

        private addEvents() {
            var self = this;
            
        }

    }
}