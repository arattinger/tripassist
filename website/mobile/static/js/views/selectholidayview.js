var TripAssist;
(function (TripAssist) {
    var SelectHolidayView = (function () {
        function SelectHolidayView() {
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
        }
        SelectHolidayView.prototype.title = function () {
            return "Select Holiday";
        };
        SelectHolidayView.prototype.name = function () {
            return "SelectHolidayView";
        };
        SelectHolidayView.prototype.render = function (ctn, data, callback) {
            ctn.innerHTML = this.mainTemplate({
            });
        };
        return SelectHolidayView;
    })();
    TripAssist.SelectHolidayView = SelectHolidayView;    
})(TripAssist || (TripAssist = {}));
