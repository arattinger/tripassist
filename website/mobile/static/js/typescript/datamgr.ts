/// <reference path="../lib/jquery.d.ts" />
/// <reference path="models.ts" />

module TripAssist {

    export class DataManager {

        offline_holidays: TripAssist.Holiday[];
        loaded_offline: bool;
        user: User;
        base_url: string;

        /**
         * stores the offline_holidays list in the localStorage object
         */
        private storeOfflineHolidays() {
            localStorage["offlineHolidays"] = JSON.stringify(this.offline_holidays);
        }

        constructor (user : User) {
            this.user = user;
            this.offline_holidays = [];
            this.loaded_offline = false;
            this.base_url = '/mobile/download/' + user.username + '/';
        }

        /**
         * fetches the holidays that are available online and returns
         * those that are not cached already
         */
        public getOnlineHolidays() {
            // TODO
        }

        /**
         * retrieves a list of already cached holidays
         */
        public getOfflineHolidays() {
            if (!this.loaded_offline) {
                this.offline_holidays = [];
                var json = localStorage["offlineHolidays"];
                if (json)
                    this.offline_holidays = JSON.parse(localStorage["offlineHolidays"]);
                this.loaded_offline = true;
            }
            return this.offline_holidays;
        }

        /**
         * marks a holiday as cached
         * @param id the id of the holiday
         * @param name the name of the holiday
         */
        public addDownloadedHoliday(holiday : TripAssist.Holiday) {
            // check if holiday does not exist downloaded already
            for (var i = 0; i<this.offline_holidays.length; i++) {
                if (this.offline_holidays[i].id == holiday.id) {
                    return;
                }
            }
            this.offline_holidays.push(holiday);

            // make changes permanent by storing in offlineadd storage
            this.storeOfflineHolidays();
        }

        /**
         * marks a holiday as not cached
         * @param id the id of the holiday
         */
        public removeDownloadedHoliday(id: number) {
            for (var i = 0; i<this.offline_holidays.length; i++) {
                if (this.offline_holidays[i].id == id) {
                    this.offline_holidays.splice(i, 1);

                    // make changes permanent by storing in offline storage
                    this.storeOfflineHolidays();
                    return;
                }
            }   
        }

        /**
         * returns a list of routes that belong to the specified holiday
         * @param holiday_id the id of the holiday the routes of which shall be returned
         */
        public getRoutesList(holiday_id: number, callback: (routes: TripAssist.Route[]) => void) : void {
            $.ajax(this.base_url + 'routes_' + holiday_id + '.json', {
                dataType: 'json',
                success: function(data, textStatus) {
                    callback(data);
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                }
            });
        }

        /**
         * returns all informations about the specified route
         * @param route_id the id of the route
         */
        public getRoute(route_id: number) {
            // TODO
        }

        /**
         * returns a list of accommodations that belong to the specified holiday
         * @param holiday_id the id of the holiday the accommodations of which shall be returned
         */
        public getAccommodationsList(holiday_id: number) {
            // TODO
        }

        /**
         * returns all informations about the specified accommodation
         * @param accommodation_id the id of the accommodation
         */
        public getAccommodation(accommodation_id: number) {
            // TODO
        }

        /**
         * returns a list of places that belong to the specified holiday
         * @param holiday_id the id of the holiday the places of which shall be returned
         */
        public getPlacesList(holiday_id: number) {
            // TODO
        }

        /**
         * returns all informations about the specified place
         * @param place_id the id of the place
         */
        public getPlace(place_id: number) {
            // TODO
        }

        /**
         * returns the schedule of the specified holiday
         * @param holiday_id the id of the holiday the schedule of which shall be returned
         */
        public getSchedule(holiday_id: number) {
            // TODO
        }
    }
}
