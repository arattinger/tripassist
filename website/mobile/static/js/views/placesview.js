var TripAssist;
(function (TripAssist) {
    var PlacesView = (function () {
        function PlacesView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('placesview.template'), {
                noEscape: true
            });
            this.waitingTemplate = Handlebars.compile(TemplateManager.getTemplate('waiting.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.allPlaces = [];
            this.lastLocation = null;
            this.checkSignalInterval = null;
            this.TIMEOUT_NO_SIGNAL = 120000;
        }
        PlacesView.prototype.title = function () {
            return "Places";
        };
        PlacesView.prototype.name = function () {
            return "PlacesView";
        };
        PlacesView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            this.currentCtn.innerHTML = this.waitingTemplate();
            this.allPlaces = this.datamgr.getPlacesList();
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
            this.loadPosition();
            callback();
        };
        PlacesView.prototype.store = function () {
            this.stored = true;
            window.clearInterval(this.checkSignalInterval);
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        PlacesView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            this.loadPosition();
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
            return true;
        };
        PlacesView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.allPlaces = null;
            window.clearInterval(this.checkSignalInterval);
        };
        PlacesView.prototype.addEvents = function () {
            var self = this;
            function navigateTo(id) {
                var place = self.datamgr.getPlace(id);
                var navItem = {
                    name: place.name,
                    longitude: place.longitude,
                    latitude: place.latitude
                };
                self.store();
                self.app.loadView('NavigationView', navItem);
            }
            function openDetail(id) {
                var place = self.datamgr.getPlace(id);
                self.store();
                self.app.loadView('PlaceDetailView', place);
            }
            $('.navigate-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                navigateTo(id);
                return false;
            });
            $('.label').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                openDetail(id);
                return false;
            });
        };
        PlacesView.prototype.checkSignal = function () {
            var now = new Date().getTime();
            if(this.lastLocation) {
                if((now - this.lastLocation.getTime()) < this.TIMEOUT_NO_SIGNAL) {
                    $('#waiting-msg').hide();
                    return;
                }
            }
            console.log('def');
            $('#waiting-msg').show();
        };
        PlacesView.prototype.loadPosition = function () {
            var currentPosition = {
                longitude: 0.0,
                latitude: 0.0
            };
            var self = this;
            function reorderList() {
                var closeList = [];
                var nearbyList = [];
                var otherList = [];
                for(var i = 0; i < self.allPlaces.length; i++) {
                    var distance = Utils.distanceInMetres(currentPosition, {
                        longitude: self.allPlaces[i].longitude,
                        latitude: self.allPlaces[i].latitude
                    });
                    var direction = Utils.angleInWords(Utils.directionInDeg(currentPosition, {
                        longitude: self.allPlaces[i].longitude,
                        latitude: self.allPlaces[i].latitude
                    }));
                    var item = {
                        id: self.allPlaces[i].id,
                        label: self.allPlaces[i].name,
                        distance: distance,
                        info: distance < 1000 ? '<p>' + direction + '</p><p>' + Math.round(distance) + ' m</p>' : '<p>' + direction + '</p><p>' + (Math.round(distance / 100) / 10) + ' km</p>'
                    };
                    if(distance <= 500.0) {
                        closeList.push(item);
                    } else if(distance < 3000.0) {
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
                sublists.push({
                    name: 'Close (&lt; 500m)',
                    items: closeList
                });
                sublists.push({
                    name: 'Nearby (&lt; 3km)',
                    items: nearbyList
                });
                sublists.push({
                    name: 'Further away',
                    items: otherList
                });
                if(!self.stored) {
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
            if(navigator.geolocation) {
                navigator.geolocation.watchPosition(getPosition, handleError, {
                    enableHighAccuracy: true,
                    maximumAge: 100000
                });
            } else {
                console.log('Geolocation is not supported by this browser');
            }
        };
        return PlacesView;
    })();
    TripAssist.PlacesView = PlacesView;    
})(TripAssist || (TripAssist = {}));
