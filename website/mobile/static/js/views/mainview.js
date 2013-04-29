var TripAssist;
(function (TripAssist) {
    var MainView = (function () {
        function MainView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('mainview.template'));
            this.storedTitle = 'Main View';
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        MainView.prototype.title = function () {
            return this.storedTitle;
        };
        MainView.prototype.name = function () {
            return "MainView";
        };
        MainView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            this.storedTitle = data.name;
            ctn.innerHTML = this.mainTemplate({
            });
            this.addEvents();
            callback();
        };
        MainView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        MainView.prototype.restore = function (ctn) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
        };
        MainView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        MainView.prototype.addEvents = function () {
            var self = this;
            $('#route-tile').on('tap', function () {
                self.app.loadView('RoutesView', null);
                return false;
            });
        };
        return MainView;
    })();
    TripAssist.MainView = MainView;    
})(TripAssist || (TripAssist = {}));
