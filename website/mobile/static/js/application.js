var TripAssist;
(function (TripAssist) {
    var Application = (function () {
        function Application() {
            this.datamgr = new TripAssist.DataManager({
                username: 'test'
            });
            this.views = [
                new TripAssist.SelectHolidayView(this.datamgr, this), 
                new TripAssist.MainView(this.datamgr, this), 
                new TripAssist.RouteDetailView(this.datamgr, this), 
                new TripAssist.RoutesView(this.datamgr, this), 
                new TripAssist.SVGView(this.datamgr, this), 
                new TripAssist.NavigationView(this.datamgr, this)
            ];
            this.viewStack = [];
            this.viewStack.push(this.views[0]);
        }
        Application.prototype.start = function () {
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('main.template'));
            $('#main-ctn').html(this.mainTemplate());
            var self = this;
            $('#back-btn').on('tap', function () {
                self.unloadView();
                return false;
            });
            this.addEvents();
            this.renderView(null);
        };
        Application.prototype.loadView = function (name, data) {
            var view = null;
            for(var i = 0; i < this.views.length; i++) {
                if(this.views[i].name() == name) {
                    view = this.views[i];
                    break;
                }
            }
            if(view == null) {
                console.log("ERROR: view with name '" + name + "' not found!");
            } else {
                if(this.viewStack[this.viewStack.length - 1] != view) {
                    this.viewStack[this.viewStack.length - 1].store();
                    this.viewStack.push(view);
                }
                this.renderView(data);
            }
        };
        Application.prototype.unloadView = function () {
            if(this.viewStack.length > 1) {
                this.viewStack[this.viewStack.length - 1].unload();
                this.viewStack.pop();
                this.viewStack[this.viewStack.length - 1].restore(document.getElementById('content-ctn'));
                this.renderTopBar();
            }
        };
        Application.prototype.renderView = function (data) {
            var self = this;
            if(this.viewStack.length != 0) {
                $('.content-ctn').html('');
                var view = this.viewStack[this.viewStack.length - 1];
                view.render(document.getElementById('content-ctn'), data, function () {
                    self.renderTopBar();
                });
            }
        };
        Application.prototype.renderTopBar = function () {
            if(this.viewStack.length > 1) {
                $('#back-btn').show();
            } else {
                $('#back-btn').hide();
            }
            document.getElementById('title').innerHTML = this.viewStack[this.viewStack.length - 1].title();
        };
        Application.prototype.addEvents = function () {
            function resize() {
                var width = $(window).width();
                $('#title').width(width - 2 * (10 + 20 + 42));
            }
            $(window).on('resize orientationchange', function () {
                resize();
            });
            resize();
        };
        return Application;
    })();
    TripAssist.Application = Application;    
})(TripAssist || (TripAssist = {}));
