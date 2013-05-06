var TripAssist;
(function (TripAssist) {
    var NavigationView = (function () {
        function NavigationView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('navigationview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.currentNavItem = null;
            this.checkSignalInterval = null;
            this.TIMEOUT_NO_SIGNAL = 30000;
        }
        NavigationView.prototype.title = function () {
            return this.currentNavItem ? this.currentNavItem.name : "Navigation";
        };
        NavigationView.prototype.name = function () {
            return "NavigationView";
        };
        NavigationView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            this.currentNavItem = data;
            ctn.innerHTML = this.mainTemplate({
            });
            this.startNavigation();
            callback();
        };
        NavigationView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
            window.clearInterval(this.checkSignalInterval);
        };
        NavigationView.prototype.restore = function (ctn) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.startNavigation();
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
        };
        NavigationView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.currentNavItem = null;
            window.clearInterval(this.checkSignalInterval);
        };
        NavigationView.prototype.checkSignal = function () {
            console.log('checking signal');
            var now = new Date().getTime();
            if(this.lastLocation && this.lastOrientation) {
                console.log((now - this.lastLocation.getTime()) + ' and ' + (now - this.lastOrientation.getTime()));
                if((now - this.lastLocation.getTime()) < this.TIMEOUT_NO_SIGNAL && (now - this.lastOrientation.getTime()) < this.TIMEOUT_NO_SIGNAL) {
                    $('#waiting-msg').hide();
                    return;
                }
            }
            $('#waiting-msg').show();
        };
        NavigationView.prototype.startNavigation = function () {
            var targetAngle = 0.0;
            var targetDistance = 0.0;
            var currentPosition = {
                longitude: 0.0,
                latitude: 0.0
            };
            var self = this;
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
            function setArrow(phone_angle, target_angle) {
                var angle = parseInt(-phone_angle + target_angle, 10);
                angle = -angle;
                if(angle < 0) {
                    angle += 360;
                }
                if(angle > 360) {
                    angle -= 360;
                }
                $('#arrow-ctn').css('-webkit-transform', 'rotate(' + angle + 'deg)');
                $('#arrow-ctn').css('-moz-transform', 'rotate(' + angle + 'deg)');
                $('#arrow-ctn').css('-ms-transform', 'rotate(' + angle + 'deg)');
                $('#arrow-ctn').css('-o-transform', 'rotate(' + angle + 'deg)');
                $('#arrow-ctn').css('transform', 'rotate(' + angle + 'deg)');
            }
            function setInfo() {
                var dist = Math.round(targetDistance) + 'm';
                if(targetDistance > 1000) {
                    dist = (targetDistance / 1000.0).toFixed(1) + 'km';
                }
                var dir = '';
                if(targetAngle >= 337.5 || targetAngle < 22.5) {
                    dir = 'N';
                } else if(targetAngle >= 22.5 && targetAngle < 67.5) {
                    dir = 'NE';
                } else if(targetAngle >= 67.5 && targetAngle < 112.5) {
                    dir = 'E';
                } else if(targetAngle >= 112.5 && targetAngle < 157.5) {
                    dir = 'SE';
                } else if(targetAngle >= 157.5 && targetAngle < 202.5) {
                    dir = 'S';
                } else if(targetAngle >= 202.5 && targetAngle < 247.5) {
                    dir = 'SW';
                } else if(targetAngle >= 247.5 && targetAngle < 292.5) {
                    dir = 'W';
                } else {
                    dir = 'NW';
                }
                $('#right-info-ctn').html('<p>' + dist + '</p><p>' + dir + '</p>');
                if(self.currentNavItem.due) {
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
                var dLon = currentPosition.longitude - self.currentNavItem.longitude;
                var y = Math.sin(dLon) * Math.cos(dLon);
                var x = Math.cos(currentPosition.latitude) * Math.sin(self.currentNavItem.latitude) - Math.sin(currentPosition.latitude) * Math.cos(self.currentNavItem.latitude) * Math.cos(dLon);
                targetAngle = rad2deg(Math.atan2(y, x));
                self.lastOrientation = new Date();
                self.checkSignal();
                setArrow(phone_angle, targetAngle);
                setInfo();
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
            if(navigator.geolocation && (window.DeviceOrientationEvent || window.OrientationEvent)) {
                navigator.geolocation.watchPosition(getPosition, handleError, {
                    enableHighAccuracy: true,
                    maximumAge: 10000
                });
                if(window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', deviceorientation, true);
                } else {
                    console.log('TODO: handle moz event');
                }
            } else {
                console.log('Device Orientation is not supported by this browser');
            }
        };
        return NavigationView;
    })();
    TripAssist.NavigationView = NavigationView;    
})(TripAssist || (TripAssist = {}));
