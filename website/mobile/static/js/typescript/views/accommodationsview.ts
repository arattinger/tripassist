/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />

module TripAssist {
    export class AccommodationsView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('accommodationsview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }

        public title() {
            return "Accommodations";
        }

        public name() {
            return "AccommodationsView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            this.currentCtn = ctn;
            var accommodations = this.datamgr.getAccommodationsList();
            function sortAccommodations(a : Accommodation, b : Accommodation) {
                return a.start.getTime() - b.start.getTime();
            }
            accommodations.sort(sortAccommodations);
            var sublists = [];
            var sublist = null;
            for (var i = 0; i<accommodations.length; i++) {
                var sublistName = accommodations[i].start.format('%b %d<sup>%o</sup>');
                if (!sublist) {
                    sublist = { name: sublistName, items: []}
                }
                if (sublist.name != sublistName) {
                    sublists.push(sublist);
                    sublist = { name: sublistName, items: []};
                }
                var daysDiff = Math.round((accommodations[i].end.getTime() - accommodations[i].start.getTime()) / 1000.0 / 60.0 / 60.0 / 24.0);
                sublist.items.push({
                    id: accommodations[i].id,
                    label: accommodations[i].name,
                    info: '<p>' + daysDiff + ' nights</p>'
                });

            }
            if (sublist) 
                sublists.push(sublist);
            ctn.innerHTML = this.mainTemplate({
                sublists: sublists
            });

            this.addEvents();
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
            this.addEvents();
            return true;
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        }

        private addEvents() {
            var self = this;
            function navigateTo(id) {
                var accommodation = self.datamgr.getAccommodation(id);
                var navItem = {
                    name : accommodation.name,
                    longitude : accommodation.longitude,
                    latitude : accommodation.latitude
                };
                self.app.loadView('NavigationView', navItem);
            }

            function loadMap(id) {
                var accommodation = self.datamgr.getAccommodation(id);
                var mapItem = {
                    name : accommodation.name,
                    longitude : accommodation.longitude,
                    latitude : accommodation.latitude
                };
                self.app.loadView('MapView', mapItem);
            }

            function openDetail(id) {
                var accommodation = self.datamgr.getAccommodation(id);
                self.app.loadView('AccommodationDetailView', accommodation);
            }

            $('.navigate-btn').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                navigateTo(id);
                return false;
            });

            $('.map-btn').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                loadMap(id);
                return false;
            });

            $('.label').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                openDetail(id);
                return false;
            });
        }

    }
}