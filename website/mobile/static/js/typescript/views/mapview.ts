/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../../lib/offlinemap.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />

// TODO: include current user location on map

module TripAssist {
    export interface MapItem extends Utils.Position {
        name? : string;
        longitude?: number;
        latitude?: number;
    }

    export class MapView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;
        private allItems: MapItem[];
        private currentItem: MapItem;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('mapview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.allItems = [];
            this.currentItem = null;
        }

        public title() {
            return this.currentItem ? this.currentItem.name : "Map";
        }

        public name() {
            return "MapView";
        }

        public render(ctn: HTMLElement, data: MapItem, callback: () => any) {
            this.currentCtn = ctn;
            this.currentItem = data;
            ctn.innerHTML = this.mainTemplate({
                
            });
            this.showMap();
            callback();
        }

        public store() {
        this.stored = true;
        if (this.currentCtn)
            this.storedHTML = this.currentCtn.innerHTML;
        }

        public restore(ctn: HTMLElement) : bool {
            if (!this.stored) return false;
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.showMap();
            return true;
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.currentItem = null;
            this.allItems = [];
        }


        private showMap() {
            OfflineMap.addRectToCache(47.3000, 15.23, 47.87, 15.43, 10, function(progress, errorMsg) {
                var map = document.getElementById('map');
                if (progress == 100) {
                    OfflineMap.render(47.074258, 15.437272, 7, map);
                } else {
                    if (errorMsg) {
                        map.innerHTML = 'ERROR: ' + errorMsg;
                    } else {
                        map.innerHTML = progress + ' % loaded';
                    }
                }
            });
        }
    }
}