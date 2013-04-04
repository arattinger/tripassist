var TripAssist;
(function (TripAssist) {
    var Application = (function () {
        function Application() {
            this.views = [
                new TripAssist.SelectHolidayView()
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
        Application.prototype.renderView = function () {
            if(this.viewStack.length != 0) {
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
