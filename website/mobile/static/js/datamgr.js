var TripAssist;
(function (TripAssist) {
    var DataManager = (function () {
        function DataManager(user) {
            this.user_ = user;
            this.offline_holidays_ = [];
            this.loaded_offline_ = false;
            this.base_url_ = '/mobile/download/' + this.user_.username + '/';
            this.current_holiday_id_ = 0;
            this.routes_ = [];
            this.accommodations_ = [];
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
        DataManager.prototype.getRoutesList = function (holiday_id, callback) {
            this.setHolidayId(holiday_id);
            if(this.routes_.length > 0) {
                callback(this.routes_);
            } else {
                var self = this;
                $.ajax(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        self.routes_ = data;
                        callback(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            }
        };
        DataManager.prototype.getRoute = function (route_id, callback) {
            function extractSingleRoute(routes) {
                for(var i = 0; i < routes.length; i++) {
                    if(routes[i].id == route_id) {
                        return routes[i];
                    }
                }
                return null;
            }
            if(this.routes_.length > 0) {
                callback(extractSingleRoute(this.routes_));
            } else {
                var self = this;
                $.ajax(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        self.routes_ = data;
                        callback(extractSingleRoute(self.routes_));
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            }
        };
        DataManager.prototype.getAccommodationsList = function (holiday_id, callback) {
            this.setHolidayId(holiday_id);
            if(this.accommodations_.length > 0) {
                callback(this.accommodations_);
            } else {
                var self = this;
                $.ajax(this.base_url_ + 'accommodations_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        self.accommodations_ = data;
                        callback(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            }
        };
        DataManager.prototype.getAccommodation = function (accommodation_id, callback) {
            function extractSingleAccommodation(accommodations) {
                for(var i = 0; i < accommodations.length; i++) {
                    if(accommodations[i].id == accommodation_id) {
                        return accommodations[i];
                    }
                }
                return null;
            }
            if(this.accommodations_.length > 0) {
                callback(extractSingleAccommodation(this.accommodations_));
            } else {
                var self = this;
                $.ajax(this.base_url_ + 'accommodations_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function (data, textStatus) {
                        self.accommodations_ = data;
                        callback(extractSingleAccommodation(self.accommodations_));
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            }
        };
        DataManager.prototype.getPlacesList = function (holiday_id) {
        };
        DataManager.prototype.getPlace = function (place_id) {
        };
        DataManager.prototype.getSchedule = function (holiday_id) {
        };
        return DataManager;
    })();
    TripAssist.DataManager = DataManager;    
})(TripAssist || (TripAssist = {}));
