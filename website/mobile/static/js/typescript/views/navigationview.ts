/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />

module TripAssist {
    export interface NavigationItem {
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

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('navigationview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.currentNavItem = null;
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
        }

        public restore(ctn: HTMLElement) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.startNavigation();
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.currentNavItem = null;
        }

        private startNavigation() {
            var targetAngle = 0.0;
            var targetDistance = 0.0; // in metres
            var currentPosition = {
                longitude: 0.0,
                latitude: 0.0
            };

            var self = this;

            function setArrow(phone_angle, target_angle) {
                var angle = parseInt(-phone_angle + target_angle, 10);
                angle = -angle; // revert for correct display
                if (angle < 0) angle+= 360;
                if (angle > 360) angle-= 360;
                console.log(phone_angle + ', ' + target_angle + ' => ' + angle);
                $('#arrow-ctn').css('-webkit-transform', 'rotate(' + angle + 'deg)')
            }

            function setInfo() {
                var dist = parseInt(targetDistance, 10) + 'm';
                if (targetDistance > 1000) dist = (targetDistance / 1000.0).toFixed(1) + 'km';
                var dir = '';
                if (targetAngle >= 337.5 && targetAngle < 22.5) dir = 'N';
                else if (targetAngle >= 22.5 && targetAngle < 67.5) dir = 'NE';
                else if (targetAngle >= 67.5 && targetAngle < 112.5) dir = 'E';
                else if (targetAngle >= 112.5 && targetAngle < 157.5) dir = 'SE';
                else if (targetAngle >= 157.5 && targetAngle < 202.5) dir = 'S';
                else if (targetAngle >= 202.5 && targetAngle < 247.5) dir = 'SW';
                else if (targetAngle >= 247.5 && targetAngle < 292.5) dir = 'W';
                else dir = 'NW';
                dir += ' (' + Math.round(targetAngle) + ')';
                $('#right-info-ctn').html('<p>' + dist + '</p><p>' + dir + '</p>');
            }

            function deg2rad(deg) {
                return deg * (Math.PI / 180.0);
            }

            function rad2deg(rad) {
                return rad * (180.0 / Math.PI);
            }

            function calculateDistance(current, target) {
                var R = 6371000; // m
                var dLat = deg2rad(current.latitude-target.latitude);
                var dLon = deg2rad(current.longitude-target.longitude);
                var lat1 = deg2rad(current.latitude);
                var lat2 = deg2rad(target.latitude);

                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c;

                targetDistance = d;
            }

            function getPosition(pos) {
                var currentLongitude = pos.coords.longitude;
                var currentLatitude = pos.coords.latitude;
                currentPosition = {
                    longitude: currentLongitude,
                    latitude: currentLatitude
                };
                calculateDistance(currentPosition, self.currentNavItem);
                setInfo();
            }

            function deviceorientation(eventData) {
                var phone_angle = eventData.alpha;

                var dLon = currentPosition.longitude - self.currentNavItem.longitude;

                var y = Math.sin(dLon) * Math.cos(dLon);
                var x = Math.cos(currentPosition.latitude)*Math.sin(self.currentNavItem.latitude) -
                Math.sin(currentPosition.latitude)*Math.cos(self.currentNavItem.latitude)*Math.cos(dLon);
                targetAngle = rad2deg(Math.atan2(y, x));

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
                    window.addEventListener('deviceorientation', deviceorientation, true);
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