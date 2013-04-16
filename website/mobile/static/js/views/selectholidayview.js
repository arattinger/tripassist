var TripAssist;
(function (TripAssist) {
    var SelectHolidayView = (function () {
        function SelectHolidayView(datamgr) {
            this.datamgr = datamgr;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
            this.listTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview-list.template'));
            this.listCtn = null;
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
            this.listCtn = $('.list-ctn');
            var self = this;
            function deleteHoliday(id) {
                console.log('TODO: remove offline holiday with id ' + id);
            }
            function downloadHoliday(id) {
                console.log('TODO: dowload holiday with id ' + id);
            }
            $('.del-btn').click(function () {
                var id = this.getAttribute('data-id');
                deleteHoliday(id);
            });
            function loadOnline() {
                self.datamgr.getOnlineHolidays(function (online_holidays) {
                    var html = self.listTemplate({
                        online_holidays: online_holidays
                    });
                    if(self.listCtn) {
                        self.listCtn.append(html);
                        $('.download-btn').click(function () {
                            var id = this.data;
                            downloadHoliday(id);
                        });
                    }
                }, function () {
                    window.setTimeout(loadOnline, 3000);
                });
            }
            loadOnline();
        };
        return SelectHolidayView;
    })();
    TripAssist.SelectHolidayView = SelectHolidayView;    
})(TripAssist || (TripAssist = {}));
