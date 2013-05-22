var TripAssist;
(function (TripAssist) {
    var RouteDetailView = (function () {
        function RouteDetailView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('routedetailview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.route = null;
        }
        RouteDetailView.prototype.title = function () {
            return this.route == null ? "Route" : this.route.name;
        };
        RouteDetailView.prototype.name = function () {
            return "RouteDetailView";
        };
        RouteDetailView.prototype.render = function (ctn, data, callback) {
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
                distanceTravelled: (distanceInMetres > 1000 ? (distanceInMetres / 1000).toFixed(1) + ' km' : (distanceInMetres.toFixed(0)) + ' m'),
                attachments: this.route.files
            });
            this.addEvents();
            callback();
        };
        RouteDetailView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        RouteDetailView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            return true;
        };
        RouteDetailView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.route = null;
        };
        RouteDetailView.prototype.addEvents = function () {
            var self = this;
            function navigateTo() {
                var navItem = {
                    name: self.route.name,
                    longitude: self.route.departure_longitude,
                    latitude: self.route.departure_latitude,
                    due: self.route.departure_time
                };
                self.app.loadView('NavigationView', navItem);
            }
            function loadMap() {
                var mapItem = {
                    name: self.route.name,
                    longitude: self.route.departure_longitude,
                    latitude: self.route.departure_latitude
                };
                self.app.loadView('MapView', mapItem);
            }
            $('#navigate-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                navigateTo();
                return false;
            });
            $('#map-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                loadMap();
                return false;
            });
            $('li div').on('tap', function () {
                var token = this.getAttribute('data-token');
                var name = this.innerHTML;
                self.app.loadView('SVGView', {
                    title: name,
                    token: token
                });
                return false;
            });
        };
        return RouteDetailView;
    })();
    TripAssist.RouteDetailView = RouteDetailView;    
})(TripAssist || (TripAssist = {}));
