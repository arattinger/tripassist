var TripAssist;
(function (TripAssist) {
    var AccommodationsView = (function () {
        function AccommodationsView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('accommodationsview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        AccommodationsView.prototype.title = function () {
            return "Accommodations";
        };
        AccommodationsView.prototype.name = function () {
            return "AccommodationsView";
        };
        AccommodationsView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            var accommodations = this.datamgr.getAccommodationsList();
            function sortAccommodations(a, b) {
                return a.start.getTime() - b.start.getTime();
            }
            accommodations.sort(sortAccommodations);
            var sublists = [];
            var sublist = null;
            for(var i = 0; i < accommodations.length; i++) {
                var sublistName = accommodations[i].start.format('%b %d<sup>%o</sup>');
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
                var daysDiff = Math.round((accommodations[i].end.getTime() - accommodations[i].start.getTime()) / 1000.0 / 60.0 / 60.0 / 24.0);
                sublist.items.push({
                    id: accommodations[i].id,
                    label: accommodations[i].name,
                    info: '<p>' + daysDiff + ' nights</p>'
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
        AccommodationsView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        AccommodationsView.prototype.restore = function (ctn) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
        };
        AccommodationsView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        AccommodationsView.prototype.addEvents = function () {
            var self = this;
            function navigateTo(id) {
                var accommodation = self.datamgr.getAccommodation(id);
                var navItem = {
                    name: accommodation.name,
                    longitude: accommodation.longitude,
                    latitude: accommodation.latitude
                };
                self.app.loadView('NavigationView', navItem);
            }
            function openDetail(id) {
                var accommodation = self.datamgr.getAccommodation(id);
                self.app.loadView('AccommodationDetailView', accommodation);
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
        return AccommodationsView;
    })();
    TripAssist.AccommodationsView = AccommodationsView;    
})(TripAssist || (TripAssist = {}));
