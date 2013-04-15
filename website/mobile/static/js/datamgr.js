var TripAssist;
(function (TripAssist) {
    var DataManager = (function () {
        function DataManager(user) {
            this.user_ = user;
            this.offline_holidays_ = [];
            this.loaded_offline_ = false;
            this.base_url_ = '/mobile/download/' + this.user_.username + '/';
            this.current_holiday_id_ = 0;
            this.loaded_holiday_ = false;
            this.routes_ = [];
            this.accommodations_ = [];
            this.places_ = [];
        }
        DataManager.prototype.storeOfflineHolidays = function () {
            localStorage["offlineHolidays"] = JSON.stringify(this.offline_holidays_);
        };
        DataManager.prototype.setHolidayId = function (id) {
            if(this.current_holiday_id_ != id) {
                this.routes_ = [];
                this.accommodations_ = [];
            }
            this.current_holiday_id_ = id;
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
            if(this.current_holiday_id_ != holiday_id) {
                this.routes_ = [];
                this.accommodations_ = [];
                this.places_ = [];
                this.current_holiday_id_ = holiday_id;
                $.ajax(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
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
                        self.places_ = data;
                        places_loaded = true;
                        done();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            }
        };
        DataManager.prototype.getOnlineHolidays = function () {
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
        DataManager.prototype.getPlacesList = function (holiday_id) {
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
        DataManager.prototype.getSchedule = function (holiday_id) {
        };
        return DataManager;
    })();
    TripAssist.DataManager = DataManager;    
})(TripAssist || (TripAssist = {}));
