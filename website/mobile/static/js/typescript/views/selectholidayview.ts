/// <reference path="view.ts" />

module TripAssist {
    export class SelectHolidayView {

        public title() {
            return "Select Holiday";
        }

        public name() {
            return "SelectHolidayView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            ctn.innerHTML = "the content of this view";
            callback();
        }

    }
}