/// <reference path="../lib/jquery.d.ts" />
/// <reference path="models.ts" />

module DataManager {

    var offline_holidays: TripAssist.Holiday[];
    var loaded_offline: bool;

    /**
     * stores the offline_holidays list in the localStorage object
     */
    function storeOfflineHolidays() {
        localStorage["offlineHolidays"] = JSON.stringify(offline_holidays);
    }

    /**
     * fetches the holidays that are available online and returns
     * those that are not cached already
     */
    export function getOnlineHolidays() {
        // TODO
    }

    /**
     * retrieves a list of already cached holidays
     */
    export function getOfflineHolidays() {
        if (!loaded_offline) {
            offline_holidays = [];
            var json = localStorage["offlineHolidays"];
            if (json)
                offline_holidays = JSON.parse(localStorage["offlineHolidays"]);
            loaded_offline = true;
        }
        return offline_holidays;
    }

    /**
     * marks a holiday as cached
     * @param id the id of the holiday
     * @param name the name of the holiday
     */
    export function addDownloadedHoliday(holiday : TripAssist.Holiday) {
        // check if holiday does not exist downloaded already
        for (var i = 0; i<offline_holidays.length; i++) {
            if (offline_holidays[i].id == holiday.id) {
                return;
            }
        }
        offline_holidays.push(holiday);

        // make changes permanent by storing in offlineadd storage
        storeOfflineHolidays();
    }

    /**
     * marks a holiday as not cached
     * @param id the id of the holiday
     */
    export function removeDownloadedHoliday(id: number) {
        for (var i = 0; i<offline_holidays.length; i++) {
            if (offline_holidays[i].id == id) {
                offline_holidays.splice(i, 1);

                // make changes permanent by storing in offline storage
                storeOfflineHolidays();
                return;
            }
        }   
    }

    /**
     * returns a list of routes that belong to the specified holiday
     * @param holiday_id the id of the holiday the routes of which shall be returned
     */
    export function getRoutesList(holiday_id: number) {
        // TODO
    }

    /**
     * returns all informations about the specified route
     * @param route_id the id of the route
     */
    export function getRoute(route_id: number) {
        // TODO
    }

    /**
     * returns a list of accommodations that belong to the specified holiday
     * @param holiday_id the id of the holiday the accommodations of which shall be returned
     */
    export function getAccommodationsList(holiday_id: number) {
        // TODO
    }

    /**
     * returns all informations about the specified accommodation
     * @param accommodation_id the id of the accommodation
     */
    export function getAccommodation(accommodation_id: number) {
        // TODO
    }

    /**
     * returns a list of places that belong to the specified holiday
     * @param holiday_id the id of the holiday the places of which shall be returned
     */
    export function getPlacesList(holiday_id: number) {
        // TODO
    }

    /**
     * returns all informations about the specified place
     * @param place_id the id of the place
     */
    export function getPlace(place_id: number) {
        // TODO
    }

    /**
     * returns the schedule of the specified holiday
     * @param holiday_id the id of the holiday the schedule of which shall be returned
     */
    export function getSchedule(holiday_id: number) {
        // TODO
    }
}
