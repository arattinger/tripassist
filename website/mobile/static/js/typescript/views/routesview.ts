/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />

module TripAssist {
    export class RoutesView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('routesview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }

        public title() {
            return "Routes";
        }

        public name() {
            return "RoutesView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            this.currentCtn = ctn;
            var routes = this.datamgr.getRoutesList();
            function sortRoutes(a : Route, b : Route) {
                return a.departure_time.getTime() - b.departure_time.getTime();
            }
            routes.sort(sortRoutes);
            var sublists = [];
            var sublist = null;
            for (var i = 0; i<routes.length; i++) {
                var sublistName = routes[i].departure_time.format('%b %d<sup>%o</sup>');
                if (!sublist) {
                    sublist = { name: sublistName, items: []}
                }
                if (sublist.name != sublistName) {
                    sublists.push(sublist);
                    sublist = { name: sublistName, items: []};
                }
                sublist.items.push({
                    label: routes[i].name,
                    info: routes[i].departure_time.format('<p>%H:%M</p>') + routes[i].arrival_time.format('<p>%H:%M</p>')
                });

            }
            if (sublist) 
                sublists.push(sublist);
            ctn.innerHTML = this.mainTemplate({
                sublists: sublists
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