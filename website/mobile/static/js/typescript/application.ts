/// <reference path="../lib/jquery.d.ts" />
/// <reference path="../lib/handlebars.d.ts" />
/// <reference path="views/selectholidayview.ts" />

module TripAssist {
    export class Application {

        /** 
         * lists all views
         */
        private views: View[];
        
        /**
         * lists the currently displayed views as stack
         */
        private viewStack: View[];

        /**
         * the main template of the application
         */
        private mainTemplate: any;

        constructor() {
            // define views
            this.views = [
                new SelectHolidayView()
            ];

            // add first view to stack
            this.viewStack = [];
            this.viewStack.push(this.views[0]);
        }

        /**
         * starts the application
         */
        public start() {
            console.log('started application');

            // load main template
            this.mainTemplate = Handlebars.compile($("#main-template").html());

            // render main application
            $('#main-ctn').html(this.mainTemplate());

            this.renderView();
        }

        private renderView() {
            if (this.viewStack.length != 0) {

                var view = this.viewStack[this.viewStack.length-1];
                document.getElementById('title').innerHTML = view.title();
                view.render(document.getElementById('content-ctn'), null, function() {
                    console.log('done rendering first view!');
                });
            }
        }
    }
}