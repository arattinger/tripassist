var TripAssist;
(function (TripAssist) {
    var DataManager = (function () {
        function DataManager(user) {
            this.user = user;
            this.offline_holidays = [];
            this.loaded_offline = false;
            this.base_url = '/mobile/download/' + user.username + '/';
        }
        DataManager.prototype.storeOfflineHolidays = function () {
            localStorage["offlineHolidays"] = JSON.stringify(this.offline_holidays);
        };
        DataManager.prototype.getOnlineHolidays = function () {
        };
        DataManager.prototype.getOfflineHolidays = function () {
            if(!this.loaded_offline) {
                this.offline_holidays = [];
                var json = localStorage["offlineHolidays"];
                if(json) {
                    this.offline_holidays = JSON.parse(localStorage["offlineHolidays"]);
                }
                this.loaded_offline = true;
            }
            return this.offline_holidays;
        };
        DataManager.prototype.addDownloadedHoliday = function (holiday) {
            for(var i = 0; i < this.offline_holidays.length; i++) {
                if(this.offline_holidays[i].id == holiday.id) {
                    return;
                }
            }
            this.offline_holidays.push(holiday);
            this.storeOfflineHolidays();
        };
        DataManager.prototype.removeDownloadedHoliday = function (id) {
            for(var i = 0; i < this.offline_holidays.length; i++) {
                if(this.offline_holidays[i].id == id) {
                    this.offline_holidays.splice(i, 1);
                    this.storeOfflineHolidays();
                    return;
                }
            }
        };
        DataManager.prototype.getRoutesList = function (holiday_id, callback) {
            $.ajax(this.base_url + 'routes_' + holiday_id + '.json', {
                dataType: 'json',
                success: function (data, textStatus) {
                    callback(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                }
            });
        };
        DataManager.prototype.getRoute = function (route_id) {
        };
        DataManager.prototype.getAccommodationsList = function (holiday_id) {
        };
        DataManager.prototype.getAccommodation = function (accommodation_id) {
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
