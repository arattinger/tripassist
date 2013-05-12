/// <reference path="../lib/jquery.d.ts" />
/// <reference path="models.ts" />

// TODO: add functionality to change user at later point

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
        schedule_: TripAssist.ScheduleElem[];

        /**
         * stores the offline_holidays_ list in the localStorage object
         */
        private storeOfflineHolidays() {
            localStorage["offlineHolidays"] = JSON.stringify(this.offline_holidays_);
        }

        /**
         * creates a schedule from all routes, accommodations and places
         * by sorting them accordingly
         */
         private createSchedule() : void {
            // add all elements to schedule
            for (var i = 0; i<this.routes_.length; i++) {
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

            for (var i = 0; i<this.accommodations_.length; i++) {
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

            // places are neglected as they do not have a start and end date
            function mySort(a : ScheduleElem, b : ScheduleElem) {
                return a.start.getTime() - b.start.getTime();
            }
            this.schedule_.sort(mySort);
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
            this.schedule_ = [];
        }

        /**
         * concatenates the URL for a downloadable file
         * @param token the token of the file
         * @param extension: the extension (including the dot) to be appended to the token
         * @return the full url to the file
         */
        public getAttachmentUrl(token : string, extension: string) : string {
            return this.base_url_ + token + extension;
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
            if (this.current_holiday_id_ != holiday_id || !this.loaded_holiday_) {
                this.routes_ = [];
                this.accommodations_ = [];
                this.places_ = [];
                this.schedule_ = [];
                this.current_holiday_id_ = holiday_id;

                $.ajax(this.base_url_ + 'routes_' + this.current_holiday_id_ + '.json', {
                    dataType: 'json',
                    success: function(data, textStatus) {
                        // create real date objects
                        for (var i = 0; i<data.length; i++) {
                            data[i].departure_time = new Date(data[i].departure_time);
                            data[i].arrival_time = new Date(data[i].arrival_time);
                            data[i].created = new Date(data[i].created);
                            data[i].last_changed = new Date(data[i].last_changed);
                        }
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
                        // create real date objects
                        for (var i = 0; i<data.length; i++) {
                            data[i].start = new Date(data[i].start);
                            data[i].end = new Date(data[i].end);
                            data[i].created = new Date(data[i].created);
                            data[i].last_changed = new Date(data[i].last_changed);
                        }
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
                        // create real date objects
                        for (var i = 0; i<data.length; i++) {
                            data[i].created = new Date(data[i].created);
                            data[i].last_changed = new Date(data[i].last_changed);
                        }
                        self.places_ = data;
                        places_loaded = true;
                        done();
                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('ERROR: ' + textStatus + ': ' + errorThrown);
                    }
                });
            } else {
                callback();
            }
        }

        /**
         * fetches the holidays that are available online and returns
         * those that are not cached already
         */
        public getOnlineHolidays(success: (list : TripAssist.Holiday[]) => void, failure: () => void) : void {
            // TODO
            //failure();
            success([]);
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
         * retrieves an already cached holiday
         */
        public getOfflineHoliday(id: number) {
            var holidays = this.getOfflineHolidays();
            for (var i = 0; i<holidays.length; i++) {
                if (holidays[i].id == id) {
                    return holidays[i];
                }
            }
            console.log("ERROR: holiday with id '" + id + "' not found!");
            return null;
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
         */
        public getPlacesList() : TripAssist.Place[] {
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
         */
        public getSchedule() : ScheduleElem[] {
            if (this.schedule_.length == 0) {
                this.createSchedule();
            }
            return this.schedule_;
        }
    }
}
