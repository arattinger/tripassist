/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />

module TripAssist {
    export class SelectHolidayView {

        private mainTemplate: any;
        private listTemplate: any;
        private listCtn: any;
        private datamgr: TripAssist.DataManager;

        constructor(datamgr : TripAssist.DataManager) {
            this.datamgr = datamgr;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
            this.listTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview-list.template'));
            this.listCtn = null;
        }

        public title() {
            return "Select Holiday";
        }

        public name() {
            return "SelectHolidayView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            var offline_holidays = this.datamgr.getOfflineHolidays();
            ctn.innerHTML = this.mainTemplate({
                offline_holidays: offline_holidays
            });
            this.listCtn = $('.list-ctn');

            // load online holidays
            var self = this;
            function loadOnline() {
                self.datamgr.getOnlineHolidays(function(online_holidays) {
                    var html = self.listTemplate({
                        online_holidays : online_holidays
                    });
                    if (self.listCtn) {
                        self.listCtn.append(html);
                    }
                }, function() {
                    // retry after interval
                    window.setTimeout(loadOnline, 3000);
                });
            }

            loadOnline();
        }

    }
}