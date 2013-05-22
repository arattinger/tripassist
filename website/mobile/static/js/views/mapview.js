var TripAssist;
(function (TripAssist) {
    var MapView = (function () {
        function MapView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('mapview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.allItems = [];
            this.currentItem = null;
        }
        MapView.prototype.title = function () {
            return this.currentItem ? this.currentItem.name : "Map";
        };
        MapView.prototype.name = function () {
            return "MapView";
        };
        MapView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            this.currentItem = data;
            ctn.innerHTML = this.mainTemplate({
            });
            this.showMap();
            callback();
        };
        MapView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        MapView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.showMap();
            return true;
        };
        MapView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.currentItem = null;
            this.allItems = [];
        };
        MapView.prototype.showMap = function () {
            var self = this;
            var map = document.getElementById('map');
            OfflineMap.render(this.currentItem.latitude, this.currentItem.longitude, 17, map);
        };
        return MapView;
    })();
    TripAssist.MapView = MapView;    
})(TripAssist || (TripAssist = {}));
