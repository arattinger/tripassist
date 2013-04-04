/// <reference path="views/selectholidayview.ts" />
/// <reference path="../lib/jquery.d.ts" />

module TripAssist {
    export class Application {

        /** 
         * lists all views
         */
        views: View[];
        
        /**
         * lists the currently displayed views as stack
         */
        viewStack: View[];

        constructor() {
            console.log(SelectHolidayView);
            this.views = [
                new SelectHolidayView()
            ];
            this.viewStack = [];

            // add first view to stack
            this.viewStack.push(this.views[0]);
        }

        /**
         * starts the application
         */
        public start() {
            console.log('started application');
            this.renderView();
        }

        private renderView() {
            if (this.viewStack.length != 0) {
                var view = this.viewStack[this.viewStack.length-1];
                view.render(document.getElementById('main-ctn'), null, function() {
                    console.log('done rendering first view!');
                });
            }
        }
    }
}