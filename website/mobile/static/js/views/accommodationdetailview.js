var TripAssist;
(function (TripAssist) {
    var AccommodationDetailView = (function () {
        function AccommodationDetailView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('accommodationdetailview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.accommodation = null;
        }
        AccommodationDetailView.prototype.title = function () {
            return this.accommodation == null ? "Accommodation" : this.accommodation.name;
        };
        AccommodationDetailView.prototype.name = function () {
            return "AccommodationDetailView";
        };
        AccommodationDetailView.prototype.render = function (ctn, data, callback) {
            this.accommodation = data;
            this.currentCtn = ctn;
            var diffInDays = Math.round((this.accommodation.end.getTime() - this.accommodation.start.getTime()) / 1000 / 60 / 60 / 24);
            ctn.innerHTML = this.mainTemplate({
                start: this.accommodation.start.format('%b %d<sup>%o</sup>'),
                end: this.accommodation.end.format('%b %d<sup>%o</sup>'),
                nights: diffInDays + (diffInDays == 1 ? ' night' : ' nights'),
                address: this.accommodation.address,
                website: this.accommodation.website,
                email: this.accommodation.email,
                phone_number: this.accommodation.phone_number,
                attachments: this.accommodation.files,
                position: this.accommodation.longitude != 0 && this.accommodation.latitude != 0
            });
            this.addEvents();
            callback();
        };
        AccommodationDetailView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        AccommodationDetailView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            return true;
        };
        AccommodationDetailView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.accommodation = null;
        };
        AccommodationDetailView.prototype.addEvents = function () {
            var self = this;
            function navigateTo() {
                var navItem = {
                    name: self.accommodation.name,
                    longitude: self.accommodation.longitude,
                    latitude: self.accommodation.latitude
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
        return AccommodationDetailView;
    })();
    TripAssist.AccommodationDetailView = AccommodationDetailView;    
})(TripAssist || (TripAssist = {}));
