/// <reference path="../lib/jquery.d.ts" />
/// <reference path="models.ts" />

module TripAssist {

    export class DataManager {

        offline_holidays_: TripAssist.Holiday[];
        loaded_offline_: bool;
        user_: User;
        base_url_: string;
        /** stores the current holiday id - if changes, all values will be removed */
        current_holiday_id_ : number;

        /** Data will be cached until explicit renewal **/
        routes_: TripAssist.Route[];

        /**
         * stores the offline_holidays_ list in the localStorage object
         */
        private storeOfflineHolidays() {
            localStorage["offlineHolidays"] = JSON.stringify(this.offline_holidays_);
        }

        /**
         * clears all cached data and resets the holiday id if different
         * from previous one
         */
         private setHolidayId(id: number) {
            if (this.current_holiday_id_ != id) {
                this.routes_ = [];
            }
            this.current_holiday_id_ = id;
         }

        constructor (user : User) {
            this.user_ = user;
            this.offline_holidays_ = [];
            this.loaded_offline_ = false;
            this.base_url_ = '/mobile/download/' + this.user_.username + '/';
            this.current_holiday_id_ = 0;
            this.routes_ = [];
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
            if (!this.loaded_offline_) {
                this.offline_holidays_ = [];
                var json = localStorage["offlineHolidays"];
                if (json)
                    this.offline_holidays_ = JSON.parse(localStorage["offlineHolidays"]);
                this.loaded_offline_ = true;
            }
            return this.offline_holidays_;
        }

        /**
         * marks a holiday as cached
         * @param id the id of the holiday
         * @param name the name of the holiday
         */
        public addDownloadedHoliday(holiday : TripAssist.Holiday) {
            // check if holiday does not exist downloaded already
            for (var i = 0; i<this.offline_holidays_.length; i++) {
                if (this.offline_holidays_[i].id == holiday.id) {
                    return;
                }
            }
            this.offline_holidays_.push(holiday);

            // make changes permanent by storing in offlineadd storage
            this.storeOfflineHolidays();
        }

        /**
         * marks a holiday as not cached
         * @param id the id of the holiday
         */
        public removeDownloadedHoliday(id: number) {
            for (var i = 0; i<this.offline_holidays_.length; i++) {
                if (this.offline_holidays_[i].id == id) {
                    this.offline_holidays_.splice(i, 1);

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
            this.setHolidayId(holiday_id);
            if (this.routes_.length > 0) {
                callback(this.routes_);
            } else {
                var self = this;
                $.ajax(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function(data, textStatus) {
                        self.routes_ = data;
                        callback(data);
                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            }
        }

        /**
         * returns all informations about the specified route
         * @param route_id the id of the route
         */
        public getRoute(route_id: number, callback: (route: TripAssist.Route) => void) : void {
            function extractSingleRoute(routes: TripAssist.Route[]) : TripAssist.Route {
                for (var i = 0; i<routes.length; i++) {
                    if (routes[i].id == route_id) {
                        return routes[i];
                    }
                }
                return null;
            }

            if (this.routes_.length > 0) {
                callback(extractSingleRoute(this.routes_));
            } else {
                var self = this;
                console.log(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json');
                $.ajax(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function(data, textStatus) {
                        self.routes_ = data;
                        console.log(extractSingleRoute);
                        callback(extractSingleRoute(self.routes_));
                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            }
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
