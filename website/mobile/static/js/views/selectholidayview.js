var TripAssist;
(function (TripAssist) {
    var SelectHolidayView = (function () {
        function SelectHolidayView(datamgr) {
            this.datamgr = datamgr;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
        }
        SelectHolidayView.prototype.title = function () {
            return "Select Holiday";
        };
        SelectHolidayView.prototype.name = function () {
            return "SelectHolidayView";
        };
        SelectHolidayView.prototype.render = function (ctn, data, callback) {
            var offline_holidays = this.datamgr.getOfflineHolidays();
            ctn.innerHTML = this.mainTemplate({
                offline_holidays: offline_holidays
            });
        };
        return SelectHolidayView;
    })();
    TripAssist.SelectHolidayView = SelectHolidayView;    
})(TripAssist || (TripAssist = {}));
