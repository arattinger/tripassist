var TripAssist;
(function (TripAssist) {
    var Application = (function () {
        function Application() {
            this.datamgr = new TripAssist.DataManager('test');
            this.views = [
                new TripAssist.SelectHolidayView(this.datamgr)
            ];
            this.viewStack = [];
            this.viewStack.push(this.views[0]);
        }
        Application.prototype.start = function () {
            console.log('started application');
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('main.template'));
            $('#main-ctn').html(this.mainTemplate());
            this.renderView();
        };
        Application.prototype.loadView = function (name) {
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
                    this.viewStack.push(view);
                }
                this.renderView();
            }
        };
        Application.prototype.renderView = function () {
            if(this.viewStack.length != 0) {
                $('.content-ctn').html('');
                var view = this.viewStack[this.viewStack.length - 1];
                document.getElementById('title').innerHTML = view.title();
                view.render(document.getElementById('content-ctn'), null, function () {
                    console.log('done rendering first view!');
                });
            }
        };
        return Application;
    })();
    TripAssist.Application = Application;    
})(TripAssist || (TripAssist = {}));
