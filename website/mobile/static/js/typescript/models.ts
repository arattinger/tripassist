/// <reference path="../lib/jquery.d.ts" />

module TripAssist {

    export interface Attachment {
        id? : number;
        filename? : string;
    }

    export interface Route {
        id? : number;
        name? : string;
        type? : string;
        created? : Date;
        last_changed? : Date;
        departure_name? : string;
        departure_longitude? : number;
        departure_latitude? : number;
        departure_altitude? : number;
        departure_address? : string;
        arrival_name? : string;
        arrival_longitude? : number;
        arrival_latitude? : number;
        arrival_altitude? : number;
        arrival_address? : string;
        files? : Attachment[];
    }

    export interface Place {
        id? : number;
        name? : string;
        type? : string;
        created? : Date;
        last_changed? : Date;
        longitude? : number;
        latitude? : number;
        altitude? : number;
        website? : string;
        email? : string;
        phone_number? : string;
        address? : string;
        files? : Attachment[];
    }

    export interface Accommodation {
        id? : number;
        created? : Date;
        last_changed? : Date;
        longitude? : number;
        latitude? : number;
        altitude? : number;
        website? : string;
        email? : string;
        phone_number? : string;
        address? : string;
        files? : Attachment[];
        start? : Date;
        end? : Date;
    }

    export interface Holiday {
        id? : number;
        name? : string;
        created? : Date;
        last_changed? : Date;
        accommodations: Accommodation[];
        places?: Place[];
        routes?: Route[];
    }
}
