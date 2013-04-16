var TripAssist;
(function (TripAssist) {
    var MainView = (function () {
        function MainView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('mainview.template'));
            this.title_ = 'Main View';
        }
        MainView.prototype.title = function () {
            return this.title_;
        };
        MainView.prototype.name = function () {
            return "MainView";
        };
        MainView.prototype.render = function (ctn, data, callback) {
            this.title_ = data.name;
            ctn.innerHTML = this.mainTemplate({
            });
            callback();
        };
        return MainView;
    })();
    TripAssist.MainView = MainView;    
})(TripAssist || (TripAssist = {}));
