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
        loaded_holiday_: bool;

        /** Data will be cached until explicit renewal **/
        routes_: TripAssist.Route[];
        accommodations_: TripAssist.Accommodation[];
        places_: TripAssist.Place[];

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
                this.accommodations_ = [];
            }
            this.current_holiday_id_ = id;
         }

        constructor (user : User) {
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

        /**
         * loads an entire holiday from the server
         * @param holiday_id the id of the holiday to be fetched
         */
        public loadHoliday(holiday_id: number, callback: () => void) : void {
            var routes_loaded = false;
            var accommodations_loaded = false;
            var places_loaded = false;

            var self = this;
            function done() {
                if (routes_loaded && accommodations_loaded && places_loaded) {
                    self.loaded_holiday_ = true;
                    callback();
                }
            }

            // only fetch if not loaded already
            if (this.current_holiday_id_ != holiday_id) {
                this.routes_ = [];
                this.accommodations_ = [];
                this.places_ = [];
                this.current_holiday_id_ = holiday_id;

                $.ajax(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function(data, textStatus) {
                        self.routes_ = data;
                        routes_loaded = true;
                        done();
                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });

                $.ajax(this.base_url_ + 'accommodations_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function(data, textStatus) {
                        self.accommodations_ = data;
                        accommodations_loaded = true;
                        done();
                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });

                $.ajax(this.base_url_ + 'places_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function(data, textStatus) {
                        self.places_ = data;
                        places_loaded = true;
                        done();
                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            }
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
         */
        public getRoutesList() : TripAssist.Route[] {
            if (this.loaded_holiday_) {
                return this.routes_;
            }
            console.log("ERROR: holiday was not loaded yet");
            return [];
        }

        /**
         * returns all informations about the specified route
         * @param route_id the id of the route
         */
        public getRoute(route_id: number) : TripAssist.Route {
            for (var i = 0; i<this.routes_.length; i++) {
                if (this.routes_[i].id == route_id) {
                    return this.routes_[i];
                }
            }
            return null;
        }

        /**
         * returns a list of accommodations that belong to the specified holiday
         */
        public getAccommodationsList() : TripAssist.Accommodation[]  {
            if (this.loaded_holiday_) {
                return this.accommodations_;
            }
            console.log("ERROR: holiday was not loaded yet");
            return [];
        }

        /**
         * returns all informations about the specified accommodation
         * @param accommodation_id the id of the accommodation
         */
        public getAccommodation(accommodation_id: number) : TripAssist.Accommodation {
            for (var i = 0; i<this.accommodations_.length; i++) {
                if (this.accommodations_[i].id == accommodation_id) {
                    return this.accommodations_[i];
                }
            }
            return null;
        }

        /**
         * returns a list of places that belong to the specified holiday
         * @param holiday_id the id of the holiday the places of which shall be returned
         */
        public getPlacesList(holiday_id: number) : TripAssist.Place[] {
            if (this.loaded_holiday_) {
                return this.places_;
            }
            console.log("ERROR: holiday was not loaded yet");
            return [];
        }

        /**
         * returns all informations about the specified place
         * @param place_id the id of the place
         */
        public getPlace(place_id: number) : TripAssist.Place {
            for (var i = 0; i<this.places_.length; i++) {
                if (this.places_[i].id == place_id) {
                    return this.places_[i];
                }
            }
            return null;
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
