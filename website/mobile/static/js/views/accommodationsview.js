var TemplateManager;
(function (TemplateManager) {
    var templates = {
    };
    function addTemplate(id, template) {
        templates[id] = template;
    }
    TemplateManager.addTemplate = addTemplate;
    function getTemplate(id) {
        return templates[id];
    }
    TemplateManager.getTemplate = getTemplate;
})(TemplateManager || (TemplateManager = {}));

var TripAssist;
(function (TripAssist) {
    var DataManager = (function () {
        function DataManager() {
            this.offline_holidays_ = [];
            this.loaded_offline_ = false;
            this.current_holiday_id_ = 0;
            this.loaded_holiday_ = false;
            this.routes_ = [];
            this.accommodations_ = [];
            this.places_ = [];
            this.schedule_ = [];
        }
        DataManager.prototype.createSchedule = function () {
            for(var i = 0; i < this.routes_.length; i++) {
                var route = this.routes_[i];
                var elem = {
                    id: route.id,
                    name: route.name,
                    elemType: 'route',
                    start: route.departure_time,
                    end: route.arrival_time
                };
                this.schedule_.push(elem);
            }
            for(var i = 0; i < this.accommodations_.length; i++) {
                var acc = this.accommodations_[i];
                var elem = {
                    id: acc.id,
                    name: acc.name,
                    elemType: 'accommodation',
                    start: acc.start,
                    end: acc.end
                };
                this.schedule_.push(elem);
            }
            function mySort(a, b) {
                return a.start.getTime() - b.start.getTime();
            }
            this.schedule_.sort(mySort);
        };
        DataManager.prototype.setUsername = function (username) {
            this.base_url_ = '/download/';
        };
        DataManager.prototype.login = function (username, password, callback) {
            localStorage["userdata"] = JSON.stringify({
                username: username,
                password: password
            });
            this.offline_holidays_ = [];
            this.loaded_offline_ = false;
            this.current_holiday_id_ = 0;
            this.loaded_holiday_ = false;
            this.routes_ = [];
            this.accommodations_ = [];
            this.places_ = [];
            this.schedule_ = [];
            this.setUsername(username);
            var success = false;
            $.post('/accounts/api_login/', {
                'username': username,
                'password': password
            }, function (data) {
                success = JSON.parse(data)['state'];
            });
            if(callback) {
                callback(success, '');
            }
        };
        DataManager.prototype.loadUser = function () {
            if(localStorage["userdata"]) {
                var result = JSON.parse(localStorage['userdata']);
                this.setUsername(result.username);
                return result;
            } else {
                return null;
            }
        };
        DataManager.prototype.getAttachmentUrl = function (token, extension) {
            return this.base_url_ + token + extension;
        };
        DataManager.prototype.loadHoliday = function (holiday_id, callback) {
            var routes_loaded = false;
            var accommodations_loaded = false;
            var places_loaded = false;
            var self = this;
            function done() {
                if(routes_loaded && accommodations_loaded && places_loaded) {
                    self.loaded_holiday_ = true;
                    callback();
                }
            }
            if(this.current_holiday_id_ != holiday_id || !this.loaded_holiday_) {
                this.routes_ = [];
                this.accommodations_ = [];
                this.places_ = [];
                this.schedule_ = [];
                this.current_holiday_id_ = holiday_id;
                $.ajax(this.base_url_ + 'holiday_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        for(var i = 0; i < data.routes.length; i++) {
                            data.routes[i].departure_time = new Date(data.routes[i].departure_time);
                            data.routes[i].arrival_time = new Date(data.routes[i].arrival_time);
                            data.routes[i].created = new Date(data.routes[i].created);
                            data.routes[i].last_changed = new Date(data.routes[i].last_changed);
                        }
                        self.routes_ = data.routes;
                        routes_loaded = true;
                        for(var i = 0; i < data.accommodations.length; i++) {
                            data.accommodations[i].departure_time = new Date(data.accommodations[i].departure_time);
                            data.accommodations[i].arrival_time = new Date(data.accommodations[i].arrival_time);
                            data.accommodations[i].created = new Date(data.accommodations[i].created);
                            data.accommodations[i].last_changed = new Date(data.accommodations[i].last_changed);
                        }
                        self.accommodations_ = data.accommodations;
                        accommodations_loaded = true;
                        for(var i = 0; i < data.places.length; i++) {
                            data.places[i].departure_time = new Date(data.places[i].departure_time);
                            data.places[i].arrival_time = new Date(data.places[i].arrival_time);
                            data.places[i].created = new Date(data.places[i].created);
                            data.places[i].last_changed = new Date(data.places[i].last_changed);
                        }
                        self.places_ = data.places;
                        places_loaded = true;
                        done();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            } else {
                callback();
            }
        };
        DataManager.prototype.getOnlineHolidays = function (success, failure) {
            success([]);
        };
        DataManager.prototype.getOfflineHolidays = function (callback, failure) {
            var self = this;
            if(!this.loaded_offline_) {
                $.ajax(this.base_url_ + 'holidays.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        for(var i = 0; i < data.length; i++) {
                            data[i].created = new Date(data[i].created);
                            data[i].last_changed = new Date(data[i].last_changed);
                            data[i].start = new Date(data[i].start);
                            data[i].end = new Date(data[i].end);
                        }
                        self.offline_holidays_ = data;
                        self.loaded_offline_ = true;
                        callback(self.offline_holidays_);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                        failure();
                    }
                });
            } else {
                callback(self.offline_holidays_);
            }
        };
        DataManager.prototype.getOfflineHoliday = function (id) {
            for(var i = 0; i < this.offline_holidays_.length; i++) {
                if(this.offline_holidays_[i].id == id) {
                    return this.offline_holidays_[i];
                }
            }
            console.log("ERROR: holiday with id '" + id + "' not found!");
            return null;
        };
        DataManager.prototype.removeDownloadedHoliday = function (id) {
            for(var i = 0; i < this.offline_holidays_.length; i++) {
                if(this.offline_holidays_[i].id == id) {
                    this.offline_holidays_.splice(i, 1);
                    return;
                }
            }
        };
        DataManager.prototype.getRoutesList = function () {
            if(this.loaded_holiday_) {
                return this.routes_;
            }
            console.log("ERROR: holiday was not loaded yet");
            return [];
        };
        DataManager.prototype.getRoute = function (route_id) {
            for(var i = 0; i < this.routes_.length; i++) {
                if(this.routes_[i].id == route_id) {
                    return this.routes_[i];
                }
            }
            return null;
        };
        DataManager.prototype.getAccommodationsList = function () {
            if(this.loaded_holiday_) {
                return this.accommodations_;
            }
            console.log("ERROR: holiday was not loaded yet");
            return [];
        };
        DataManager.prototype.getAccommodation = function (accommodation_id) {
            for(var i = 0; i < this.accommodations_.length; i++) {
                if(this.accommodations_[i].id == accommodation_id) {
                    return this.accommodations_[i];
                }
            }
            return null;
        };
        DataManager.prototype.getPlacesList = function () {
            if(this.loaded_holiday_) {
                return this.places_;
            }
            console.log("ERROR: holiday was not loaded yet");
            return [];
        };
        DataManager.prototype.getPlace = function (place_id) {
            for(var i = 0; i < this.places_.length; i++) {
                if(this.places_[i].id == place_id) {
                    return this.places_[i];
                }
            }
            return null;
        };
        DataManager.prototype.getSchedule = function () {
            if(this.schedule_.length == 0) {
                this.createSchedule();
            }
            return this.schedule_;
        };
        return DataManager;
    })();
    TripAssist.DataManager = DataManager;    
})(TripAssist || (TripAssist = {}));

(function () {
    Date.prototype.diffInWords = function (other) {
        var delta = Math.round((this.getTime() - other.getTime()) / 1000);
        if(Math.abs(delta) < 60) {
            return 'Now';
        }
        var suffix = delta > 0 ? 'from now' : 'ago';
        if(delta < 0) {
            delta = -delta;
        }
        var units = {
            minute: 60,
            hour: 60,
            day: 24,
            week: 7,
            month: 52 / 12,
            year: 12,
            eon: Infinity
        };
        var msg = 'Now';
        for(var unit in units) {
            var interval = units[unit];
            if(delta < 1.5 * interval) {
                if(delta > 0.75 * interval) {
                    delta /= interval;
                    msg = unit;
                }
                break;
            }
            delta /= interval;
            msg = unit + 's';
        }
        delta = Math.round(delta);
        if(delta == 1) {
            msg = 'about one ' + msg + ' ' + suffix;
        } else {
            msg = 'about ' + delta + ' ' + msg + ' ' + suffix;
        }
        return msg;
    };
    Date.prototype.format = function (format) {
        function pad(n, digits, string) {
            if(digits == 1) {
                return n;
            }
            return n < Math.pow(10, digits - 1) ? (string || '0') + pad(n, digits - 1, string) : n;
        }
        ; ;
        function ordinal(d) {
            if(d == 1 || d == 21 || d == 31) {
                return "st";
            }
            if(d == 2 || d == 22) {
                return "nd";
            }
            if(d == 3 || d == 23) {
                return "rd";
            }
            return "th";
        }
        function ampm(h) {
            if(h <= 12) {
                return "am";
            }
            return "pm";
        }
        function getMsg(type) {
            switch(type) {
                case 'days_abbr': {
                    return [
                        'Sun', 
                        'Mon', 
                        'Tue', 
                        'Wed', 
                        'Thu', 
                        'Fri', 
                        'Sat'
                    ];

                }
                case 'days': {
                    return [
                        'Sunday', 
                        'Monday', 
                        'Tuesday', 
                        'Wednesday', 
                        'Thursday', 
                        'Friday', 
                        'Saturday'
                    ];

                }
                case 'months_abbr': {
                    return [
                        'Jan', 
                        'Feb', 
                        'Mar', 
                        'Apr', 
                        'May', 
                        'Jun', 
                        'Jul', 
                        'Aug', 
                        'Sep', 
                        'Oct', 
                        'Nov', 
                        'Dec'
                    ];

                }
                case 'months': {
                    return [
                        'January', 
                        'February', 
                        'March', 
                        'April', 
                        'May', 
                        'June', 
                        'July', 
                        'August', 
                        'September', 
                        'October', 
                        'November', 
                        'December'
                    ];

                }
            }
        }
        var d = this;
        return format.replace(/%([a-z%])/gi, function ($0, $1) {
            switch($1) {
                case 'a': {
                    return getMsg('days_abbr')[d.getDay()];

                }
                case 'A': {
                    return getMsg('days')[d.getDay()];

                }
                case 'b': {
                    return getMsg('months_abbr')[d.getMonth()];

                }
                case 'B': {
                    return getMsg('months')[d.getMonth()];

                }
                case 'c': {
                    return d.format('%a %b %d %H:%M:%S %Y');

                }
                case 'd': {
                    return pad(d.getDate(), 2, '0');

                }
                case 'e': {
                    return pad(d.getDate(), 2, ' ');

                }
                case 'H': {
                    return pad(d.getHours(), 2, '0');

                }
                case 'I': {
                    return pad((d.getHours() % 12) || 12, 2, '0');

                }
                case 'k': {
                    return pad(d.getHours(), 2, ' ');

                }
                case 'l': {
                    return pad((d.getHours() % 12) || 12, 2, ' ');

                }
                case 'L': {
                    return pad(d.getMilliseconds(), 3, '0');

                }
                case 'm': {
                    return pad((d.getMonth() + 1), 2, '0');

                }
                case 'M': {
                    return pad(d.getMinutes(), 2, '0');

                }
                case 'o': {
                    return ordinal(d.getDate());

                }
                case 'p': {
                    return ampm(d.getHours());

                }
                case 's': {
                    return Math.round(d.getTime() / 1000);

                }
                case 'S': {
                    return pad(d.getSeconds(), 2, '0');

                }
                case 'T': {
                    return d.format('%H:%M:%S');

                }
                case 'w': {
                    return d.getDate();

                }
                case 'y': {
                    return d.getFullYear().toString().substr(2);

                }
                case 'Y': {
                    return d.getFullYear().toString();

                }
            }
            return $1;
        });
    };
})();
var Utils;
(function (Utils) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    function rad2deg(rad) {
        return rad * (180 / Math.PI);
    }
    function distanceInMetres(posA, posB) {
        var R = 6371000;
        var dLat = deg2rad(posA.latitude - posB.latitude);
        var dLon = deg2rad(posA.longitude - posB.longitude);
        var lat1 = deg2rad(posA.latitude);
        var lat2 = deg2rad(posB.latitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    Utils.distanceInMetres = distanceInMetres;
    function directionInDeg(origin, destination) {
        var dLon = deg2rad(destination.longitude - origin.longitude);
        var lat1 = deg2rad(origin.latitude);
        var lat2 = deg2rad(destination.latitude);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var result = rad2deg(Math.atan2(y, x));
        if(result < 0) {
            result += 360;
        }
        return result;
    }
    Utils.directionInDeg = directionInDeg;
    function angleInWords(angle) {
        var dir = '';
        if(angle >= 337.5 || angle < 22.5) {
            dir = 'N';
        } else {
            if(angle >= 22.5 && angle < 67.5) {
                dir = 'NE';
            } else {
                if(angle >= 67.5 && angle < 112.5) {
                    dir = 'E';
                } else {
                    if(angle >= 112.5 && angle < 157.5) {
                        dir = 'SE';
                    } else {
                        if(angle >= 157.5 && angle < 202.5) {
                            dir = 'S';
                        } else {
                            if(angle >= 202.5 && angle < 247.5) {
                                dir = 'SW';
                            } else {
                                if(angle >= 247.5 && angle < 292.5) {
                                    dir = 'W';
                                } else {
                                    dir = 'NW';
                                }
                            }
                        }
                    }
                }
            }
        }
        return dir;
    }
    Utils.angleInWords = angleInWords;
})(Utils || (Utils = {}));

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
            console.log(this.accommodation);
            window.acc = this.accommodation;
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

var TripAssist;
(function (TripAssist) {
    var MainView = (function () {
        function MainView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('mainview.template'));
            this.storedTitle = 'Main View';
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        MainView.prototype.title = function () {
            return this.storedTitle;
        };
        MainView.prototype.name = function () {
            return "MainView";
        };
        MainView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            this.storedTitle = data.name;
            ctn.innerHTML = this.mainTemplate({
            });
            this.addEvents();
            callback();
        };
        MainView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        MainView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            return true;
        };
        MainView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        MainView.prototype.addEvents = function () {
            var self = this;
            $('#route-tile').on('tap', function () {
                self.app.loadView('RoutesView', null);
                return false;
            });
            $('#accomm-tile').on('tap', function () {
                self.app.loadView('AccommodationsView', null);
                return false;
            });
            $('#places-tile').on('tap', function () {
                self.app.loadView('PlacesView', null);
                return false;
            });
            $('#schedule-tile').on('tap', function () {
                self.app.loadView('ScheduleView', null);
                return false;
            });
        };
        return MainView;
    })();
    TripAssist.MainView = MainView;    
})(TripAssist || (TripAssist = {}));

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
            this.mode = 'portrait';
            var self = this;
            $(window).on('resize orientationchange', function () {
                self.onResize();
            });
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
            this.onResize();
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
            this.onResize();
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
        NavigationView.prototype.onResize = function () {
            if(!this.stored) {
                var landscape = $(window).width() > $(window).height();
                this.mode = landscape ? 'landscape' : 'portrait';
                var height = $('#arrow-ctn').parent().height() - 100;
                height -= 50;
                $('#arrow-ctn').css('height', height);
                $('#arrow-ctn').css('width', height);
                $('#arrow-ctn').css('-o-background-size', height + 'px ' + height + 'px');
                $('#arrow-ctn').css('-webkit-background-size', height + 'px ' + height + 'px');
                $('#arrow-ctn').css('-khtml-background-size', height + 'px ' + height + 'px');
                $('#arrow-ctn').css('-moz-background-size', height + 'px ' + height + 'px');
                $('#arrow-ctn').css('background-size', height + 'px ' + height + 'px');
            }
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
            var targetAngle = 0;
            var targetDistance = 0;
            var currentPosition = {
                longitude: 0,
                latitude: 0
            };
            var self = this;
            this.checkSignalInterval = window.setInterval(this.checkSignal, this.TIMEOUT_NO_SIGNAL);
            function setArrow(phone_angle, target_angle) {
                phone_angle = 360 - phone_angle;
                if(self.mode == 'landscape') {
                    phone_angle += 90;
                }
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
                    dist = (targetDistance / 1000).toFixed(1) + 'km';
                }
                var dir = Utils.angleInWords(targetAngle);
                $('#right-info-ctn').html('<p>' + dist + '</p><p>' + dir + '</p>');
                if(self.currentNavItem.due) {
                    $('#left-info-ctn').html(self.currentNavItem.due.diffInWords(new Date()));
                }
            }
            function rad2deg(rad) {
                return rad * (180 / Math.PI);
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
                    case error.PERMISSION_DENIED: {
                        console.log("User denied the request for Geolocation.");
                        break;

                    }
                    case error.POSITION_UNAVAILABLE: {
                        console.log("Location information is unavailable.");
                        break;

                    }
                    case error.TIMEOUT: {
                        console.log("The request to get user location timed out.");
                        break;

                    }
                    case error.UNKNOWN_ERROR: {
                        console.log("An unknown error occurred.");
                        break;

                    }
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
                longitude: 0,
                latitude: 0
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
                    if(distance <= 500) {
                        closeList.push(item);
                    } else {
                        if(distance < 3000) {
                            nearbyList.push(item);
                        } else {
                            otherList.push(item);
                        }
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
                    case error.PERMISSION_DENIED: {
                        console.log("User denied the request for Geolocation.");
                        break;

                    }
                    case error.POSITION_UNAVAILABLE: {
                        console.log("Location information is unavailable.");
                        break;

                    }
                    case error.TIMEOUT: {
                        console.log("The request to get user location timed out.");
                        break;

                    }
                    case error.UNKNOWN_ERROR: {
                        console.log("An unknown error occurred.");
                        break;

                    }
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
        };
        return RouteDetailView;
    })();
    TripAssist.RouteDetailView = RouteDetailView;    
})(TripAssist || (TripAssist = {}));

var TripAssist;
(function (TripAssist) {
    var RoutesView = (function () {
        function RoutesView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('routesview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        RoutesView.prototype.title = function () {
            return "Routes";
        };
        RoutesView.prototype.name = function () {
            return "RoutesView";
        };
        RoutesView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            var routes = this.datamgr.getRoutesList();
            function sortRoutes(a, b) {
                return a.departure_time.getTime() - b.departure_time.getTime();
            }
            routes.sort(sortRoutes);
            var sublists = [];
            var sublist = null;
            for(var i = 0; i < routes.length; i++) {
                var sublistName = routes[i].departure_time.format('%b %d<sup>%o</sup>');
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
                sublist.items.push({
                    id: routes[i].id,
                    label: routes[i].name,
                    info: routes[i].departure_time.format('<p>%H:%M</p>') + routes[i].arrival_time.format('<p>%H:%M</p>')
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
        RoutesView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        RoutesView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            return true;
        };
        RoutesView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        RoutesView.prototype.addEvents = function () {
            var self = this;
            function navigateTo(id) {
                var route = self.datamgr.getRoute(id);
                var navItem = {
                    name: route.name,
                    longitude: route.departure_longitude,
                    latitude: route.departure_latitude,
                    due: route.departure_time
                };
                self.app.loadView('NavigationView', navItem);
            }
            function openDetail(id) {
                var route = self.datamgr.getRoute(id);
                self.app.loadView('RouteDetailView', route);
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
        return RoutesView;
    })();
    TripAssist.RoutesView = RoutesView;    
})(TripAssist || (TripAssist = {}));

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
                    var daysDiff = Math.round((items[i].end.getTime() - items[i].start.getTime()) / 1000 / 60 / 60 / 24);
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
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            return true;
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

var TripAssist;
(function (TripAssist) {
    var LoginView = (function () {
        function LoginView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('loginview.template'));
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        LoginView.prototype.title = function () {
            return 'Login';
        };
        LoginView.prototype.name = function () {
            return "LoginView";
        };
        LoginView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
            });
            this.addEvents();
            $('#settings-btn').hide();
            callback();
        };
        LoginView.prototype.store = function () {
            this.stored = true;
            $('#settings-btn').show();
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        LoginView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            $('#settings-btn').hide();
            this.addEvents();
            return true;
        };
        LoginView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            $('#settings-btn').show();
        };
        LoginView.prototype.addEvents = function () {
            var self = this;
            $('#login-btn').on('tap', function () {
                self.datamgr.login($('#username-input').val(), $('#password-input').val(), function (success, errorMsg) {
                    if(!success) {
                        $('#info-ctn').html(errorMsg);
                        $('#info-ctn').show();
                        window.setTimeout(function () {
                            $('#info-ctn').hide();
                        }, 2000);
                    } else {
                        self.app.settingsDone();
                    }
                });
                return false;
            });
        };
        return LoginView;
    })();
    TripAssist.LoginView = LoginView;    
})(TripAssist || (TripAssist = {}));

var TripAssist;
(function (TripAssist) {
    var SelectHolidayView = (function () {
        function SelectHolidayView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
            this.listTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview-list.template'));
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        SelectHolidayView.prototype.title = function () {
            return "select holiday";
        };
        SelectHolidayView.prototype.name = function () {
            return "SelectHolidayView";
        };
        SelectHolidayView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
            });
            this.addEvents();
            this.loadOnlineHolidays($('.list-ctn'));
            this.loadOfflineHolidays($('.list-ctn'));
            callback();
        };
        SelectHolidayView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        SelectHolidayView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            this.loadOnlineHolidays($('.list-ctn'));
            return true;
        };
        SelectHolidayView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        SelectHolidayView.prototype.addEvents = function () {
            var self = this;
            function deleteHoliday(id) {
                console.log('TODO: remove offline holiday with id ' + id);
            }
            function downloadHoliday(id) {
                console.log('TODO: dowload holiday with id ' + id);
            }
            function openHoliday(id) {
                self.datamgr.loadHoliday(id, function () {
                    self.app.loadView('MainView', self.datamgr.getOfflineHoliday(id));
                });
            }
            $('.del-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                deleteHoliday(id);
                return false;
            });
            $('.label').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                openHoliday(id);
                return false;
            });
            $('.download-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                downloadHoliday(id);
                return false;
            });
        };
        SelectHolidayView.prototype.loadOnlineHolidays = function (ctn) {
            var self = this;
            function loadOnline() {
                self.datamgr.getOnlineHolidays(function (online_holidays) {
                    if(!self.stored) {
                        var previousList = $('#online-holidays-list');
                        if(previousList) {
                            previousList.empty();
                            var html = "";
                            for(var i = 0; i < online_holidays.length; i++) {
                                html += "<li data-id='" + online_holidays[i].id + "'>\n" + "    <div class='label'>" + online_holidays[i].name + "'\n" + "    <div class='download-btn'></div>";
                            }
                            previousList.html(html);
                        } else {
                            var html = self.listTemplate({
                                title: 'ONLINE',
                                id: 'online-holidays-list',
                                offline: false,
                                holidays: online_holidays
                            });
                            ctn.append(html);
                        }
                        self.addEvents();
                    }
                }, function () {
                    if(!self.stored) {
                        window.setTimeout(loadOnline, 3000);
                    }
                });
            }
            loadOnline();
        };
        SelectHolidayView.prototype.loadOfflineHolidays = function (ctn) {
            var self = this;
            function loadOffline() {
                self.datamgr.getOfflineHolidays(function (holidays) {
                    if(!self.stored) {
                        var previousList = $('#offline-holidays-list');
                        if(previousList.length) {
                            previousList.empty();
                            var html = "";
                            for(var i = 0; i < holidays.length; i++) {
                                html += "<li data-id='" + holidays[i].id + "'>\n" + "    <div class='label'>" + holidays[i].name + "'\n" + "    <div class='download-btn'></div>";
                            }
                            previousList.html(html);
                        } else {
                            var html = self.listTemplate({
                                title: 'OFFLINE',
                                offline: true,
                                id: 'offline-holidays-list',
                                holidays: holidays
                            });
                            ctn.append(html);
                        }
                        self.addEvents();
                    }
                }, function () {
                    if(!self.stored) {
                        window.setTimeout(loadOffline, 3000);
                    }
                });
            }
            loadOffline();
        };
        return SelectHolidayView;
    })();
    TripAssist.SelectHolidayView = SelectHolidayView;    
})(TripAssist || (TripAssist = {}));

var TripAssist;
(function (TripAssist) {
    var SVGView = (function () {
        function SVGView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('svgview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.title_ = 'Route';
            this.currentZoom_ = 1;
        }
        SVGView.prototype.title = function () {
            return this.title_;
        };
        SVGView.prototype.name = function () {
            return "SVGView";
        };
        SVGView.prototype.render = function (ctn, data, callback) {
            this.title_ = data.title;
            this.currentCtn = ctn;
            var self = this;
            ctn.innerHTML = "loading...";
            $.ajax(this.datamgr.getAttachmentUrl(data.token, '.svg'), {
                dataType: 'text',
                success: function (svg) {
                    ctn.innerHTML = '<div id="svg-ctn">' + svg + '</div>';
                    self.addEvents();
                    self.setZoomable();
                }
            });
            callback();
        };
        SVGView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
            this.unsetZoomable();
        };
        SVGView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            this.setZoomable();
            return true;
        };
        SVGView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.unsetZoomable();
        };
        SVGView.prototype.addEvents = function () {
            var self = this;
            function scale(level) {
                $('#svg-ctn').css('transform', 'scale(' + level + ',' + level + ')');
                $('#svg-ctn').css('-ms-transform', 'scale(' + level + ',' + level + ')');
                $('#svg-ctn').css('-webkit-transform', 'scale(' + level + ',' + level + ')');
                $('#svg-ctn').css('transform-origin', 'left top');
                $('#svg-ctn').css('-ms-transform-origin', 'left top');
                $('#svg-ctn').css('-webkit-transform-origin', 'left top');
            }
        };
        SVGView.prototype.setZoomable = function () {
            $('#content-ctn').css('overflow', 'hidden');
        };
        SVGView.prototype.unsetZoomable = function () {
            $('#content-ctn').css('overflow', 'auto');
        };
        return SVGView;
    })();
    TripAssist.SVGView = SVGView;    
})(TripAssist || (TripAssist = {}));

var TripAssist;
(function (TripAssist) {
    var Application = (function () {
        function Application() {
            this.datamgr = new TripAssist.DataManager();
            this.views = [
                new TripAssist.LoginView(this.datamgr, this), 
                new TripAssist.SelectHolidayView(this.datamgr, this), 
                new TripAssist.MainView(this.datamgr, this), 
                new TripAssist.RouteDetailView(this.datamgr, this), 
                new TripAssist.RoutesView(this.datamgr, this), 
                new TripAssist.SVGView(this.datamgr, this), 
                new TripAssist.NavigationView(this.datamgr, this), 
                new TripAssist.PlacesView(this.datamgr, this), 
                new TripAssist.ScheduleView(this.datamgr, this), 
                new TripAssist.PlaceDetailView(this.datamgr, this), 
                new TripAssist.AccommodationsView(this.datamgr, this), 
                new TripAssist.AccommodationDetailView(this.datamgr, this), 
                
            ];
            this.viewStack = [];
            if(this.datamgr.loadUser() == null) {
                this.viewStack.push(this.views[0]);
            } else {
                this.viewStack.push(this.views[1]);
            }
        }
        Application.prototype.start = function () {
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('main.template'));
            $('#main-ctn').html(this.mainTemplate());
            var self = this;
            $('#back-btn').on('tap', function () {
                $('#content-ctn').removeClass('viewin-left');
                $('#content-ctn').removeClass('viewin-right');
                $('#content-ctn').addClass('viewout-right');
                window.setTimeout(function () {
                    $('#content-ctn').removeClass('viewout-right');
                    $('#content-ctn').empty();
                    1;
                    $('#content-ctn').addClass('viewin-left');
                    if(history && history.pushState) {
                        history.back();
                    } else {
                        self.unloadView();
                    }
                }, 300);
                return false;
            });
            if(window.addEventListener) {
                window.addEventListener('popstate', function (e) {
                    self.unloadView();
                });
            }
            this.addEvents();
            this.renderView(null);
        };
        Application.prototype.loadView = function (name, data) {
            var view = null;
            for(var i = 0; i < this.views.length; i++) {
                if(this.views[i].name() == name) {
                    view = this.views[i];
                    break;
                }
            }
            if(view == null) {
                console.log("ERROR: view with name '" + name + "' not found!");
            } else {
                if(this.viewStack[this.viewStack.length - 1] != view) {
                    this.viewStack[this.viewStack.length - 1].store();
                    this.viewStack.push(view);
                    if(history && history.pushState) {
                        history.pushState(null, null, '?' + view.name());
                    }
                }
                if(this.viewStack.length > 1) {
                    $('#settings-btn').hide();
                } else {
                    $('#settings-btn').show();
                }
                this.renderView(data);
            }
        };
        Application.prototype.settingsDone = function () {
            this.views[0].unload();
            this.views[1].unload();
            this.viewStack = [
                this.views[1]
            ];
            this.renderView(null);
        };
        Application.prototype.unloadView = function () {
            if(this.viewStack.length > 1) {
                this.viewStack[this.viewStack.length - 1].unload();
                this.viewStack.pop();
                if(this.viewStack.length == 1) {
                    $('#settings-btn').show();
                }
                if(!this.viewStack[this.viewStack.length - 1].restore(document.getElementById('content-ctn'))) {
                    this.renderView(null);
                }
                this.renderTopBar();
            }
        };
        Application.prototype.renderView = function (data) {
            var self = this;
            if(this.viewStack.length != 0) {
                var self = this;
                $('#content-ctn').removeClass('viewin-left');
                $('#content-ctn').removeClass('viewin-right');
                $('#content-ctn').addClass('viewout-left');
                window.setTimeout(function () {
                    $('#content-ctn').removeClass('viewout-left');
                    $('#content-ctn').empty();
                    $('#content-ctn').addClass('viewin-right');
                    var view = self.viewStack[self.viewStack.length - 1];
                    view.render(document.getElementById('content-ctn'), data, function () {
                        self.renderTopBar();
                    });
                }, 300);
            }
        };
        Application.prototype.renderTopBar = function () {
            if(this.viewStack.length > 1) {
                $('#back-btn').show();
            } else {
                $('#back-btn').hide();
            }
            document.getElementById('title').innerHTML = this.viewStack[this.viewStack.length - 1].title();
        };
        Application.prototype.addEvents = function () {
            function resize() {
                var width = $(window).width();
                $('#title').width(width - 2 * (10 + 20 + 42));
            }
            $(window).on('resize orientationchange', function () {
                resize();
            });
            resize();
            var self = this;
            $('#settings-btn').on('tap', function () {
                self.loadView('LoginView', null);
                return false;
            });
        };
        return Application;
    })();
    TripAssist.Application = Application;    
})(TripAssist || (TripAssist = {}));

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
                window.a = a;
                window.b = b;
                return new Date(a.start).getTime() - new Date(b.start).getTime();
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
                var daysDiff = Math.round((accommodations[i].end.getTime() - accommodations[i].start.getTime()) / 1000 / 60 / 60 / 24);
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
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            return true;
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

