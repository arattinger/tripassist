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
        DataManager.prototype.storeOfflineHolidays = function () {
            localStorage["offlineHolidays"] = JSON.stringify(this.offline_holidays_);
        };
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
            this.base_url_ = '/download/' + username + '/';
        };
        DataManager.prototype.login = function (username, password, callback) {
            localStorage["userdata"] = JSON.stringify({
                username: username,
                password: password
            });
            this.setUsername(username);
            if(callback) {
                callback(true, '');
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
                $.ajax(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        for(var i = 0; i < data.length; i++) {
                            data[i].departure_time = new Date(data[i].departure_time);
                            data[i].arrival_time = new Date(data[i].arrival_time);
                            data[i].created = new Date(data[i].created);
                            data[i].last_changed = new Date(data[i].last_changed);
                        }
                        self.routes_ = data;
                        routes_loaded = true;
                        done();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
                $.ajax(this.base_url_ + 'accommodations_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        for(var i = 0; i < data.length; i++) {
                            data[i].start = new Date(data[i].start);
                            data[i].end = new Date(data[i].end);
                            data[i].created = new Date(data[i].created);
                            data[i].last_changed = new Date(data[i].last_changed);
                        }
                        self.accommodations_ = data;
                        accommodations_loaded = true;
                        done();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
                $.ajax(this.base_url_ + 'places_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        for(var i = 0; i < data.length; i++) {
                            data[i].created = new Date(data[i].created);
                            data[i].last_changed = new Date(data[i].last_changed);
                        }
                        self.places_ = data;
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
        DataManager.prototype.getOfflineHolidays = function () {
            if(!this.loaded_offline_) {
                this.offline_holidays_ = [];
                var json = localStorage["offlineHolidays"];
                if(json) {
                    this.offline_holidays_ = JSON.parse(localStorage["offlineHolidays"]);
                }
                this.loaded_offline_ = true;
            }
            return this.offline_holidays_;
        };
        DataManager.prototype.getOfflineHoliday = function (id) {
            var holidays = this.getOfflineHolidays();
            for(var i = 0; i < holidays.length; i++) {
                if(holidays[i].id == id) {
                    return holidays[i];
                }
            }
            console.log("ERROR: holiday with id '" + id + "' not found!");
            return null;
        };
        DataManager.prototype.addDownloadedHoliday = function (holiday) {
            for(var i = 0; i < this.offline_holidays_.length; i++) {
                if(this.offline_holidays_[i].id == holiday.id) {
                    return;
                }
            }
            this.offline_holidays_.push(holiday);
            this.storeOfflineHolidays();
        };
        DataManager.prototype.removeDownloadedHoliday = function (id) {
            for(var i = 0; i < this.offline_holidays_.length; i++) {
                if(this.offline_holidays_[i].id == id) {
                    this.offline_holidays_.splice(i, 1);
                    this.storeOfflineHolidays();
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
