/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../models.ts" />

module TripAssist {
    export class PlaceDetailView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;
        private place: Place;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('placedetailview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.place = null;
        }

        public title() {
            return this.place == null ? "Place" : this.place.name;
        }

        public name() {
            return "PlaceDetailView";
        }

        public render(ctn: HTMLElement, data: Place, callback: () => any) {
            this.place = data;
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
                address: this.place.address,
                website: this.place.website,
                email: this.place.email,
                phone_number: this.place.phone_number,
                attachments: this.place.files,
                position: this.place.longitude != 0 && this.place.latitude != 0
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
            this.place = null;
        }

        private addEvents() {
            var self = this;
            function navigateTo() {
                var navItem = {
                    name : self.place.name,
                    longitude : self.place.longitude,
                    latitude : self.place.latitude
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