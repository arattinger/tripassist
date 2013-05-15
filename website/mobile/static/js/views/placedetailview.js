var TripAssist;
(function (TripAssist) {
    var PlaceDetailView = (function () {
        function PlaceDetailView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('placedetailview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.place = null;
        }
        PlaceDetailView.prototype.title = function () {
            return this.place == null ? "Place" : this.place.name;
        };
        PlaceDetailView.prototype.name = function () {
            return "PlaceDetailView";
        };
        PlaceDetailView.prototype.render = function (ctn, data, callback) {
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
        };
        PlaceDetailView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        PlaceDetailView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            return true;
        };
        PlaceDetailView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.place = null;
        };
        PlaceDetailView.prototype.addEvents = function () {
            var self = this;
            function navigateTo() {
                var navItem = {
                    name: self.place.name,
                    longitude: self.place.longitude,
                    latitude: self.place.latitude
                };
                self.app.loadView('NavigationView', navItem);
            }
            $('#navigate-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                navigateTo();
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
            $('#web-btn').on('taphold', function () {
                window.open(this.innerHTML, '_blank');
            });
            $('#email-btn').on('taphold', function () {
                window.open('mailto:' + this.innerHTML, 'link-target');
            });
            $('#phone-btn').on('taphold', function () {
                var phone = this.innerHTML;
                phone = phone.replace(/[^\+0-9]+/g, '');
                window.open('tel:' + phone, 'link-target');
            });
        };
        return PlaceDetailView;
    })();
    TripAssist.PlaceDetailView = PlaceDetailView;    
})(TripAssist || (TripAssist = {}));
