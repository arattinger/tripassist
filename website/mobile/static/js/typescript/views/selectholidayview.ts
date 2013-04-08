/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />

module TripAssist {
    export class SelectHolidayView {

        private mainTemplate: any;

        constructor() {
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
        }

        public title() {
            return "Select Holiday";
        }

        public name() {
            return "SelectHolidayView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            ctn.innerHTML = this.mainTemplate({

            });
        }

    }
}