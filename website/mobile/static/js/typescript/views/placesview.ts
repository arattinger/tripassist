/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />
/// <reference path="../utils.ts" />

module TripAssist {
    export class PlacesView {

        private mainTemplate: any;
        private waitingTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;
        private allPlaces: TripAssist.Place[];
        private lastLocation: Date;
        private checkSignalInterval: any;
        private TIMEOUT_NO_SIGNAL : number;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('placesview.template'), {noEscape: true});
            this.waitingTemplate = Handlebars.compile(TemplateManager.getTemplate('waiting.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.allPlaces = [];
            this.lastLocation = null;
            this.checkSignalInterval = null;
            this.TIMEOUT_NO_SIGNAL = 120000;
        }

        public title() {
            return "Places";
        }

        public name() {
            return "PlacesView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            this.currentCtn = ctn;
            this.currentCtn.innerHTML = this.waitingTemplate();
            this.allPlaces = this.datamgr.getPlacesList();
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
            this.loadPosition();
            callback();
        }

        public store() {
        this.stored = true;
        window.clearInterval(this.checkSignalInterval);
        if (this.currentCtn)
            this.storedHTML = this.currentCtn.innerHTML;
        }

        public restore(ctn: HTMLElement) : bool {
            if (!this.stored) return false;
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            this.loadPosition();
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
            return true;
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.allPlaces = null;
            window.clearInterval(this.checkSignalInterval);
        }

        private addEvents() {
            var self = this;
            function navigateTo(id) {
                var place = self.datamgr.getPlace(id);
                var navItem = {
                    name : place.name,
                    longitude : place.longitude,
                    latitude : place.latitude
                };
                self.store();
                self.app.loadView('NavigationView', navItem);
            }

             function loadMap(id) {
                var place = self.datamgr.getPlace(id);
                var mapItem = {
                    name : place.name,
                    longitude : place.longitude,
                    latitude : place.latitude
                };
                self.app.loadView('MapView', mapItem);
            }

            function openDetail(id) {
                var place = self.datamgr.getPlace(id);
                self.store();
                self.app.loadView('PlaceDetailView', place);
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

        private checkSignal() {
            // hide message if signal and orientation are available, display otherwise
            var now = new Date().getTime();
            if (this.lastLocation) {
                if ( (now - this.lastLocation.getTime()) < this.TIMEOUT_NO_SIGNAL ) {
                    $('#waiting-msg').hide();
                    return;
                }    
            }
            console.log('def');
            $('#waiting-msg').show();
        }

        private loadPosition() {
            var currentPosition = {
                longitude: 0.0,
                latitude: 0.0
            };

            var self = this;

            function reorderList() {
                var closeList = [];
                var nearbyList = [];
                var otherList = [];
                for (var i = 0; i<self.allPlaces.length; i++) {
                    var distance = Utils.distanceInMetres(currentPosition, {
                            longitude: self.allPlaces[i].longitude,
                            latitude: self.allPlaces[i].latitude
                        });
                    var direction  = Utils.angleInWords(
                        Utils.directionInDeg(currentPosition, {
                            longitude: self.allPlaces[i].longitude,
                            latitude: self.allPlaces[i].latitude
                        })
                    );
                    var item = {
                        id: self.allPlaces[i].id,
                        label: self.allPlaces[i].name,
                        distance: distance,
                        info: distance < 1000 ? '<p>' + direction + '</p><p>' + Math.round(distance) + ' m</p>' : '<p>' + direction + '</p><p>' + (Math.round(distance/100) / 10) + ' km</p>'
                    };
                    if (distance <= 500.0) {
                        closeList.push(item);
                    } else if (distance < 3000.0) {
                        nearbyList.push(item);
                    } else {
                        otherList.push(item);
                    }
                }

                function sortList(a, b) {
                    return a.distance - b.distance;
                }

                closeList.sort(sortList);
                nearbyList.sort(sortList);
                otherList.sort(sortList);

                var sublists = [];
                sublists.push({ name: 'Close (&lt; 500m)', items: closeList});
                sublists.push({ name: 'Nearby (&lt; 3km)', items: nearbyList});
                sublists.push({ name: 'Further away', items: otherList });
                
                if (!self.stored) {
                    self.currentCtn.innerHTML = self.mainTemplate({
                        sublists: sublists
                    });
                    self.addEvents();
                    $('#waiting-msg').hide();
                }
            }

            function getPosition(pos) {
                var currentLongitude = pos.coords.longitude;
                var currentLatitude = pos.coords.latitude;
                currentPosition = {
                    longitude: currentLongitude,
                    latitude: currentLatitude
                };
                self.lastLocation = new Date();
                reorderList();
                self.checkSignal();
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

            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(getPosition, handleError, {
                        enableHighAccuracy: true,
                        maximumAge: 100000
                    }
                );
            } else {
                // TODO: some more elaborated error message maybe?
                console.log('Geolocation is not supported by this browser');
            }
        }

    }
}