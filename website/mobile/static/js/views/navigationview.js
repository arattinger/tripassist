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
            this.TIMEOUT_NO_SIGNAL = 120000;
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
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.startNavigation();
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
            return true;
        };
        NavigationView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.currentNavItem = null;
            window.clearInterval(this.checkSignalInterval);
        };
        NavigationView.prototype.checkSignal = function () {
            var now = new Date().getTime();
            if(this.lastLocation && this.lastOrientation) {
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
                phone_angle = 360 - phone_angle;
                var angle = parseInt(-phone_angle + target_angle, 10);
                while(angle < 0) {
                    angle += 360;
                }
                while(angle > 360) {
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
                var dir = Utils.angleInWords(targetAngle);
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
                var nua = navigator.userAgent;
                if(nua.indexOf('Android') > -1 && nua.indexOf('Opera') == -1 && nua.indexOf('Gecko') == -1) {
                    phone_angle -= 90;
                    if(phone_angle < 0) {
                        phone_angle += 360;
                    }
                }
                if(nua.indexOf('Safari') > -1) {
                    phone_angle += 90;
                    if(phone_angle > 360) {
                        phone_angle -= 360;
                    }
                }
                targetAngle = Utils.directionInDeg(currentPosition, self.currentNavItem);
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
                    window.addEventListener('deviceorientation', deviceorientation, false);
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
