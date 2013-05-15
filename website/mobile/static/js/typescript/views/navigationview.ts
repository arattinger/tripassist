/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />

module TripAssist {
    export interface NavigationItem extends Utils.Position {
        name? : string;
        longitude?: number;
        latitude?: number;
        due?: Date;
    }

    export class NavigationView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;
        private currentNavItem: NavigationItem;
        private checkSignalInterval: any;
        private lastLocation: Date;
        private lastOrientation: Date;
        private TIMEOUT_NO_SIGNAL : number;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('navigationview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.currentNavItem = null;
            this.checkSignalInterval = null;
            this.TIMEOUT_NO_SIGNAL = 120000;
        }

        public title() {
            return this.currentNavItem ? this.currentNavItem.name : "Navigation";
        }

        public name() {
            return "NavigationView";
        }

        public render(ctn: HTMLElement, data: NavigationItem, callback: () => any) {
            this.currentCtn = ctn;
            this.currentNavItem = data;
            ctn.innerHTML = this.mainTemplate({
                
            });
            this.startNavigation();
            callback();
        }

        public store() {
        this.stored = true;
        if (this.currentCtn)
            this.storedHTML = this.currentCtn.innerHTML;
            window.clearInterval(this.checkSignalInterval);
        }

        public restore(ctn: HTMLElement) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.startNavigation();
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.currentNavItem = null;
            window.clearInterval(this.checkSignalInterval);
        }

        private checkSignal() {
            // hide message if signal and orientation are available, display otherwise
            var now = new Date().getTime();
            if (this.lastLocation && this.lastOrientation) {
                if ( (now - this.lastLocation.getTime()) < this.TIMEOUT_NO_SIGNAL && (now - this.lastOrientation.getTime()) < this.TIMEOUT_NO_SIGNAL ) {
                    $('#waiting-msg').hide();
                    return;
                }    
            }
            $('#waiting-msg').show();
        }

        private startNavigation() {
            var targetAngle: number = 0.0;
            var targetDistance: number = 0.0; // in metres
            var currentPosition = {
                longitude: 0.0,
                latitude: 0.0
            };

            var self = this;
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);

            function setArrow(phone_angle, target_angle) {
                phone_angle = 360-phone_angle; // revert for correct display
                var angle = parseInt(-phone_angle + target_angle, 10);
                while (angle < 0) angle+= 360;
                while (angle > 360) angle-= 360;
                $('#arrow-ctn').css('-webkit-transform', 'rotate(' + angle + 'deg)');
                $('#arrow-ctn').css('-moz-transform', 'rotate(' + angle + 'deg)');
                $('#arrow-ctn').css('-ms-transform', 'rotate(' + angle + 'deg)');
                $('#arrow-ctn').css('-o-transform', 'rotate(' + angle + 'deg)');
                $('#arrow-ctn').css('transform', 'rotate(' + angle + 'deg)');
            }

            function setInfo() {
                var dist = Math.round(targetDistance) + 'm';
                if (targetDistance > 1000) dist = (targetDistance / 1000.0).toFixed(1) + 'km';
                var dir = Utils.angleInWords(targetAngle);
                $('#right-info-ctn').html('<p>' + dist + '</p><p>' + dir + '</p>');

                // calculate remaining time
                if (self.currentNavItem.due) {
                    $('#left-info-ctn').html(self.currentNavItem.due.diffInWords(new Date()));
                }
            }

            function rad2deg(rad) {
                return rad * (180.0 / Math.PI);
            }

            function getPosition(pos) {
                var currentLongitude = pos.coords.longitude;
                var currentLatitude = pos.coords.latitude;
                currentPosition = {
                    longitude: currentLongitude,
                    latitude: currentLatitude
                };
                self.lastLocation = new Date();
                self.checkSignal();
                targetDistance = Utils.distanceInMetres(currentPosition, self.currentNavItem);
                setInfo();
            }

            function deviceorientation(eventData) {
                var phone_angle = eventData.alpha;
                // add or remove according to browser
                // see http://lists.w3.org/Archives/Public/public-geolocation/2012Jun/0000.html
                var nua = navigator.userAgent;
                if (nua.indexOf('Android') > -1 && nua.indexOf('Opera') == -1 && nua.indexOf('Gecko') == -1) {// native android or chrome
                    phone_angle -= 90;
                    if (phone_angle < 0)
                        phone_angle += 360;
                }
                if (nua.indexOf('Safari') > -1) { // if IOS
                    phone_angle += 90;
                    if (phone_angle > 360)
                        phone_angle -= 360;
                }
                targetAngle = Utils.directionInDeg(currentPosition, self.currentNavItem);

                self.lastOrientation = new Date();
                self.checkSignal();

                setArrow(phone_angle, targetAngle);
                setInfo();
            }

            function handleError(error) {
                // TODO: proper error handling
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                      console.log("User denied the request for Geolocation.");
                      break;
                    case error.POSITION_UNAVAILABLE:
                      console.log("Location information is unavailable.");
                      break;
                    case error.TIMEOUT:
                      console.log("The request to get user location timed out.");
                      break;
                    case error.UNKNOWN_ERROR:
                      console.log("An unknown error occurred.");
                      break;
                }
            }
            if (navigator.geolocation && (window.DeviceOrientationEvent || window.OrientationEvent) ) {
                navigator.geolocation.watchPosition(getPosition, handleError, {
                        enableHighAccuracy: true,
                        maximumAge: 10000
                    }
                );
                if (window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', deviceorientation, false);
                } else {
                    console.log('TODO: handle moz event');
                }
            } else {
                // TODO: some more elaborated error message maybe?
                console.log('Device Orientation is not supported by this browser');
            }
        }

    }
}