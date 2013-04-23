/**
 * some parts taken from mootools
 * (https://github.com/mootools/mootools-more/blob/master/Source/Types/Date.js and
 * https://github.com/mootools/mootools-more/blob/master/Source/Types/Date.Extras.js)
 */

declare interface Date {
    format(format : string) : string;
    diffInWords(other: Date) : string;
}

declare interface Window {
    DeviceOrientationEvent : any;
    OrientationEvent: any;
}

(function() {
    Date.prototype.diffInWords = function(other) {
        var delta = Math.round((this.getTime() - other.getTime())/1000);
        if (Math.abs(delta) < 60) return 'Now'; // same minute
        var suffix = delta > 0 ? 'from now' : 'ago';
        if (delta < 0) delta = -delta;

        var units = {
            minute: 60,
            hour: 60,
            day: 24,
            week: 7,
            month: 52 / 12,
            year: 12,
            eon: Infinity
        };

        var msg = 'Now';

        for (var unit in units){
            var interval = units[unit];
            if (delta < 1.5 * interval){
                if (delta > 0.75 * interval) {
                    delta /= interval;
                    msg = unit;
                }
                break;
            }
            delta /= interval;
            msg = unit + 's';
        }

        delta = Math.round(delta);
        if (delta == 1) {
            msg = 'about one ' + msg + ' ' + suffix;
        } else {
            msg = 'about ' + delta + ' ' + msg + ' ' + suffix;
        }
        return msg;
    };

    Date.prototype.format = function(format) {

        function pad(n, digits, string){
            if (digits == 1) return n;
            return n < Math.pow(10, digits - 1) ? (string || '0') + pad(n, digits - 1, string) : n;
        };

        function ordinal(d) {
            if (d == 1 || d == 21 || d == 31) return "st";
            if (d == 2 || d == 22) return "nd";
            if (d == 3 || d == 23) return "rd";
            return "th";
        }

        function ampm(h) {
            if (h<=12)
                return "am";
            return "pm";
        }

        function getMsg(type) {
            switch(type) {
                case 'days_abbr':
                    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                case 'days':
                    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                case 'months_abbr':
                    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                case 'months':
                    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                            'September', 'October', 'November', 'December'];
            }
        }


        var d = this;
            return format.replace(/%([a-z%])/gi,
                function($0, $1){
                    switch ($1){
                        case 'a': return getMsg('days_abbr')[d.getDay()];
                        case 'A': return getMsg('days')[d.getDay()];
                        case 'b': return getMsg('months_abbr')[d.getMonth()];
                        case 'B': return getMsg('months')[d.getMonth()];
                        case 'c': return d.format('%a %b %d %H:%M:%S %Y');
                        case 'd': return pad(d.getDate(), 2, '0');
                        case 'e': return pad(d.getDate(), 2, ' ');
                        case 'H': return pad(d.getHours(), 2, '0');
                        case 'I': return pad((d.getHours() % 12) || 12, 2, '0');
                        case 'k': return pad(d.getHours(), 2, ' ');
                        case 'l': return pad((d.getHours() % 12) || 12, 2, ' ');
                        case 'L': return pad(d.getMilliseconds(), 3, '0');
                        case 'm': return pad((d.getMonth() + 1), 2, '0');
                        case 'M': return pad(d.getMinutes(), 2, '0');
                        case 'o': return ordinal(d.getDate());
                        case 'p': return ampm(d.getHours());
                        case 's': return Math.round(d.getTime() / 1000);
                        case 'S': return pad(d.getSeconds(), 2, '0');
                        case 'T': return d.format('%H:%M:%S');
                        case 'w': return d.getDate();
                        case 'y': return d.getFullYear().toString().substr(2);
                        case 'Y': return d.getFullYear().toString();
                    }
                    return $1;
                }
            );

    };
})();