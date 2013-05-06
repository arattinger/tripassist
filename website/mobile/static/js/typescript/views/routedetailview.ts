/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../models.ts" />

module TripAssist {
    export class RouteDetailView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;
        private route: Route;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('routedetailview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.route = null;
        }

        public title() {
            return this.route == null ? "Route" : this.route.name;
        }

        public name() {
            return "RouteDetailView";
        }

        public render(ctn: HTMLElement, data: Route, callback: () => any) {
            this.route = data;
            this.currentCtn = ctn;
            var diffInMin = Math.round((this.route.arrival_time.getTime() - this.route.departure_time.getTime()) / 1000 / 60);
            var mins = diffInMin % 60;
            var hours = Math.floor(diffInMin / 60);
            var distanceInMetres = Utils.distanceInMetres({
                    longitude: this.route.departure_longitude,
                    latitude: this.route.departure_latitude
                }, {
                    longitude: this.route.arrival_longitude,
                    latitude: this.route.arrival_latitude
                });
            ctn.innerHTML = this.mainTemplate({
                departureTime: this.route.departure_time.format('%b %d<sup>%o</sup>, %H:%M'),
                arrivalTime: this.route.arrival_time.format('%b %d<sup>%o</sup>, %H:%M'),
                departureAddress: this.route.departure_name,
                arrivalAddress: this.route.arrival_name,
                timeTravelled: (hours == 0 ? '' : hours + ' h ') + mins + ' min',
                distanceTravelled: (distanceInMetres > 1000 ? (distanceInMetres / 1000).toFixed(1) + ' km' : distanceInMetres + ' m'),
                attachments: this.route.files
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
            this.route = null;
        }

        private addEvents() {
            var self = this;
            function navigateTo() {
                var navItem = {
                    name : self.route.name,
                    longitude : self.route.departure_longitude,
                    latitude : self.route.departure_latitude,
                    due: self.route.departure_time
                };
                self.app.loadView('NavigationView', navItem);
            }

            $('#navigate-btn').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                navigateTo();
                return false;
            });

            $('li div').on('tap', function() {
                var token = this.getAttribute('data-token');
                var name = this.innerHTML;
                self.app.loadView('SVGView', {
                    title: name,
                    token: token
                });
                return false;
            });
            
        }

    }
}