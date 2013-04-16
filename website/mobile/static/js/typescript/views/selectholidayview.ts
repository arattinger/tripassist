/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />

module TripAssist {
    export class SelectHolidayView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;

        constructor(datamgr : TripAssist.DataManager) {
            this.datamgr = datamgr;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
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
        }

    }
}