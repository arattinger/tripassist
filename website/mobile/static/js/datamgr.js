var DataManager;
(function (DataManager) {
    var offline_holidays;
    var loaded_offline;
    function storeOfflineHolidays() {
        localStorage["offlineHolidays"] = JSON.stringify(offline_holidays);
    }
    function getOnlineHolidays() {
    }
    DataManager.getOnlineHolidays = getOnlineHolidays;
    function getOfflineHolidays() {
        if(!loaded_offline) {
            offline_holidays = [];
            var json = localStorage["offlineHolidays"];
            if(json) {
                offline_holidays = JSON.parse(localStorage["offlineHolidays"]);
            }
            loaded_offline = true;
        }
        return offline_holidays;
    }
    DataManager.getOfflineHolidays = getOfflineHolidays;
    function addDownloadedHoliday(holiday) {
        for(var i = 0; i < offline_holidays.length; i++) {
            if(offline_holidays[i].id == holiday.id) {
                return;
            }
        }
        offline_holidays.push(holiday);
        storeOfflineHolidays();
    }
    DataManager.addDownloadedHoliday = addDownloadedHoliday;
    function removeDownloadedHoliday(id) {
        for(var i = 0; i < offline_holidays.length; i++) {
            if(offline_holidays[i].id == id) {
                offline_holidays.splice(i, 1);
                storeOfflineHolidays();
                return;
            }
        }
    }
    DataManager.removeDownloadedHoliday = removeDownloadedHoliday;
    function getRoutesList(holiday_id) {
    }
    DataManager.getRoutesList = getRoutesList;
    function getRoute(route_id) {
    }
    DataManager.getRoute = getRoute;
    function getAccommodationsList(holiday_id) {
    }
    DataManager.getAccommodationsList = getAccommodationsList;
    function getAccommodation(accommodation_id) {
    }
    DataManager.getAccommodation = getAccommodation;
    function getPlacesList(holiday_id) {
    }
    DataManager.getPlacesList = getPlacesList;
    function getPlace(place_id) {
    }
    DataManager.getPlace = getPlace;
    function getSchedule(holiday_id) {
    }
    DataManager.getSchedule = getSchedule;
})(DataManager || (DataManager = {}));
