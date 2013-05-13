/// <reference path="../lib/jquery.d.ts" />
/// <reference path="../lib/handlebars.d.ts" />
/// <reference path="templatemgr.ts" />
/// <reference path="datamgr.ts" />
/// <reference path="views/accommodationsview.ts" />
/// <reference path="views/accommodationdetailview.ts" />
/// <reference path="views/mainview.ts" />
/// <reference path="views/navigationview.ts" />
/// <reference path="views/placesview.ts" />
/// <reference path="views/placedetailview.ts" />
/// <reference path="views/routedetailview.ts" />
/// <reference path="views/routesview.ts" />
/// <reference path="views/scheduleview.ts" />
/// <reference path="views/selectholidayview.ts" />
/// <reference path="views/svgview.ts" />


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
            this.datamgr = new TripAssist.DataManager({ username: 'test'});
            this.views = [
                new SelectHolidayView(this.datamgr, this),
                new MainView(this.datamgr, this),
                new RouteDetailView(this.datamgr, this),
                new RoutesView(this.datamgr, this),
                new SVGView(this.datamgr, this),
                new NavigationView(this.datamgr, this),
                new PlacesView(this.datamgr, this),
                new ScheduleView(this.datamgr, this),
                new PlaceDetailView(this.datamgr, this),
                new AccommodationsView(this.datamgr, this),
                new AccommodationDetailView(this.datamgr, this)
            ];

            // add first view to stack
            this.viewStack = [];
            this.viewStack.push(this.views[0]);
        }

        /**
         * starts the application
         */
        public start() : void{

            // load main template
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('main.template'));

            // render main application
            $('#main-ctn').html(this.mainTemplate());

            // add back functionality
            var self = this;
            $('#back-btn').on('tap', function() {
                self.unloadView();
                return false;
            });

            this.addEvents();

            this.renderView(null);
        }

        /**
         * renders a specific view
         * @param the name of the view
         * @param data the data to be passed to the render function of the view
         */
        public loadView(name : string, data: any) : void{

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
                    // store current view
                    this.viewStack[this.viewStack.length-1].store();
                    // push new view
                    this.viewStack.push(view);
                }
                this.renderView(data);
            }
        }

        /**
         * unloads the top view
         */
        public unloadView() : void{

            if (this.viewStack.length > 1) {
                this.viewStack[this.viewStack.length-1].unload();
                this.viewStack.pop();
                // restore previous view
                this.viewStack[this.viewStack.length-1].restore(document.getElementById('content-ctn'));
            
                this.renderTopBar();
            }
        }

        private renderView(data : any) : void {
            var self = this;
            if (this.viewStack.length != 0) {

                // clear content
                $('.content-ctn').html('');
                var view = this.viewStack[this.viewStack.length-1];
                view.render(document.getElementById('content-ctn'), data, function() {
                    self.renderTopBar();
                });
            }
        }

        private renderTopBar() {
            // enable back button
            if (this.viewStack.length > 1) {
                $('#back-btn').show();
            } else {
                $('#back-btn').hide();
            }

            document.getElementById('title').innerHTML = this.viewStack[this.viewStack.length-1].title();
        }

        private addEvents() {
            function resize() {
                // resize title
                var width = $(window).width();
                $('#title').width( width - 2 * (10 + 20 + 42));
            }

            $(window).on('resize orientationchange', function() { resize(); });

            // resize initially
            resize();
        }
    }
}