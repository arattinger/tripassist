/// <reference path="../lib/jquery.d.ts" />
/// <reference path="../lib/handlebars.d.ts" />
/// <reference path="templatemgr.ts" />
/// <reference path="datamgr.ts" />
/// <reference path="views/selectholidayview.ts" />

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

        /**
         * the main template of the application
         */
        mainTemplate: any;

        /**
         * the data manager of the current user
         */
        datamgr: TripAssist.DataManager;

        constructor() {
            // define views
            // TODO: change username accordingly (from localstorage?)
            // e.g. if (!this.datamgr.loadUser()) { viewStack.push(new LoginView()); }
            this.datamgr = new TripAssist.DataManager('test');
            this.views = [
                new SelectHolidayView(this.datamgr)
            ];

            // add first view to stack
            this.viewStack = [];
            this.viewStack.push(this.views[0]);
        }

        /**
         * starts the application
         */
        public start() : void{
            console.log('started application');

            // load main template
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('main.template'));

            // render main application
            $('#main-ctn').html(this.mainTemplate());

            this.renderView();
        }

        /**
         * renders a specific view
         */
        public loadView(name : string) : void{

            // find view
            var view = null;
            for (var i = 0; i<this.views.length; i++) {
                if (this.views[i].name() == name) {
                    view = this.views[i];
                    break;
                }
            }
            if (view == null) {
                console.log("ERROR: view with name '" + name + "' not found!");
            } else {
                // add to stack if not already at end
                if (this.viewStack[this.viewStack.length-1] != view) {
                    this.viewStack.push(view);
                }
                this.renderView();
            }
        }

        private renderView() : void {
            if (this.viewStack.length != 0) {
                // clear content
                $('.content-ctn').html('');
                var view = this.viewStack[this.viewStack.length-1];
                document.getElementById('title').innerHTML = view.title();
                view.render(document.getElementById('content-ctn'), null, function() {
                    console.log('done rendering first view!');
                });
            }
        }
    }
}