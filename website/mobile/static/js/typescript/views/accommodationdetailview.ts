/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../models.ts" />

module TripAssist {
    export class AccommodationDetailView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;
        private accommodation: Accommodation;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('accommodationdetailview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.accommodation = null;
        }

        public title() {
            return this.accommodation == null ? "Accommodation" : this.accommodation.name;
        }

        public name() {
            return "AccommodationDetailView";
        }

        public render(ctn: HTMLElement, data: Accommodation, callback: () => any) {
            this.accommodation = data;
            this.currentCtn = ctn;
            var diffInDays = Math.round((this.accommodation.end.getTime() - this.accommodation.start.getTime()) / 1000 / 60 / 60 / 24);
            ctn.innerHTML = this.mainTemplate({
                start: this.accommodation.start.format('%b %d<sup>%o</sup>'),
                end: this.accommodation.end.format('%b %d<sup>%o</sup>'),
                nights: diffInDays + (diffInDays == 1 ? ' night' : ' nights'),
                address: this.accommodation.address,
                website: this.accommodation.website,
                email: this.accommodation.email,
                phone_number: this.accommodation.phone_number,
                attachments: this.accommodation.files,
                position: this.accommodation.longitude != 0 && this.accommodation.latitude != 0
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
            this.accommodation = null;
        }

        private addEvents() {
            var self = this;
            function navigateTo() {
                var navItem = {
                    name : self.accommodation.name,
                    longitude : self.accommodation.longitude,
                    latitude : self.accommodation.latitude
                };
                self.app.loadView('NavigationView', navItem);
            }

            function loadMap() {
                var mapItem = {
                    name : self.accommodation.name,
                    longitude : self.accommodation.longitude,
                    latitude : self.accommodation.latitude
                };
                self.app.loadView('MapView', mapItem);
            }

            $('#navigate-btn').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                navigateTo();
                return false;
            });

            $('#map-btn').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                loadMap();
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

            $('#web-btn').on('taphold', function() {
                window.open(this.innerHTML, '_blank');
            });

            $('#email-btn').on('taphold', function() {
                window.open('mailto:'+this.innerHTML, 'link-target');
            });

            $('#phone-btn').on('taphold', function() {
                // remove everything but '+' and digits
                var phone = this.innerHTML;
                phone = phone.replace(/[^\+0-9]+/g, '');
                window.open('tel:'+phone, 'link-target');
            });
            
        }

    }
}