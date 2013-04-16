var TripAssist;
(function (TripAssist) {
    var RoutesView = (function () {
        function RoutesView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('routesview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        RoutesView.prototype.title = function () {
            return "Routes";
        };
        RoutesView.prototype.name = function () {
            return "RoutesView";
        };
        RoutesView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            var routes = this.datamgr.getRoutesList();
            function sortRoutes(a, b) {
                return a.departure_time.getTime() - b.departure_time.getTime();
            }
            routes.sort(sortRoutes);
            var sublists = [];
            var sublist = null;
            for(var i = 0; i < routes.length; i++) {
                var sublistName = routes[i].departure_time.format('%b %d<sup>%o</sup>');
                if(!sublist) {
                    sublist = {
                        name: sublistName,
                        items: []
                    };
                }
                if(sublist.name != sublistName) {
                    sublists.push(sublist);
                    sublist = {
                        name: sublistName,
                        items: []
                    };
                }
                sublist.items.push({
                    label: routes[i].name,
                    info: routes[i].departure_time.format('<p>%H:%M</p>') + routes[i].arrival_time.format('<p>%H:%M</p>')
                });
            }
            if(sublist) {
                sublists.push(sublist);
            }
            ctn.innerHTML = this.mainTemplate({
                sublists: sublists
            });
            callback();
        };
        RoutesView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        RoutesView.prototype.restore = function (ctn) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
        };
        RoutesView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        return RoutesView;
    })();
    TripAssist.RoutesView = RoutesView;    
})(TripAssist || (TripAssist = {}));
