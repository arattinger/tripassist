var TripAssist;
(function (TripAssist) {
    var ScheduleView = (function () {
        function ScheduleView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('scheduleview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        ScheduleView.prototype.title = function () {
            return "Schedule";
        };
        ScheduleView.prototype.name = function () {
            return "ScheduleView";
        };
        ScheduleView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            var items = this.datamgr.getAccommodationsList().concat(this.datamgr.getRoutesList());
            function sortItems(a, b) {
                var startA = a.start ? a.start.getTime() : a.departure_time.getTime();
                var startB = b.start ? b.start.getTime() : b.departure_time.getTime();
                return startA - startB;
            }
            items.sort(sortItems);
            var sublists = [];
            var sublist = null;
            for(var i = 0; i < items.length; i++) {
                var sublistName = items[i].start ? items[i].start.format('%b %d<sup>%o</sup>') : items[i].departure_time.format('%b %d<sup>%o</sup>');
                if(!sublist) {
                    sublist = {
                        name: sublistName,
                        items: []
                    };
                }
                if(sublist.name != sublistName) {
                    sublists.push(sublist);
                    sublist = {
                        name: sublistName,
                        items: []
                    };
                }
                var info = '';
                var type = '';
                if(items[i].start) {
                    var daysDiff = Math.round((items[i].end.getTime() - items[i].start.getTime()) / 1000.0 / 60.0 / 60.0 / 24.0);
                    info = '<p>' + daysDiff + ' nights</p>';
                    type = 'accommodation';
                } else {
                    info = items[i].departure_time.format('<p>%H:%M</p>') + items[i].arrival_time.format('<p>%H:%M</p>');
                    type = 'route';
                }
                sublist.items.push({
                    id: items[i].id,
                    label: items[i].name,
                    info: info,
                    type: type
                });
            }
            if(sublist) {
                sublists.push(sublist);
            }
            ctn.innerHTML = this.mainTemplate({
                sublists: sublists
            });
            this.addEvents();
            callback();
        };
        ScheduleView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        ScheduleView.prototype.restore = function (ctn) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
        };
        ScheduleView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        ScheduleView.prototype.addEvents = function () {
            var self = this;
            function navigateTo(id, type) {
                var navItem = null;
                if(type == 'accommodation') {
                    var accommodation = self.datamgr.getAccommodation(id);
                    navItem = {
                        name: accommodation.name,
                        longitude: accommodation.longitude,
                        latitude: accommodation.latitude
                    };
                } else {
                    var route = self.datamgr.getRoute(id);
                    navItem = {
                        name: route.name,
                        longitude: route.departure_longitude,
                        latitude: route.departure_latitude,
                        due: route.departure_time
                    };
                }
                self.app.loadView('NavigationView', navItem);
            }
            function openDetail(id, type) {
                if(type == 'accommodation') {
                    var accommodation = self.datamgr.getAccommodation(id);
                    self.app.loadView('AccommodationDetailView', accommodation);
                } else {
                    var route = self.datamgr.getRoute(id);
                    self.app.loadView('RouteDetailView', route);
                }
            }
            $('.navigate-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                var type = this.parentNode.getAttribute('data-type');
                navigateTo(id, type);
                return false;
            });
            $('.label').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                var type = this.parentNode.getAttribute('data-type');
                openDetail(id, type);
                return false;
            });
        };
        return ScheduleView;
    })();
    TripAssist.ScheduleView = ScheduleView;    
})(TripAssist || (TripAssist = {}));
