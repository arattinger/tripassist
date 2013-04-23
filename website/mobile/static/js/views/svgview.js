var TripAssist;
(function (TripAssist) {
    var SVGView = (function () {
        function SVGView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('svgview.template'), {
                noEscape: true
            });
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.title_ = 'Route';
        }
        SVGView.prototype.title = function () {
            return this.title_;
        };
        SVGView.prototype.name = function () {
            return "SVGView";
        };
        SVGView.prototype.render = function (ctn, data, callback) {
            this.title_ = data.title;
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
                url: this.datamgr.getAttachmentUrl(data.token, '.svg')
            });
            this.addEvents();
            callback();
        };
        SVGView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        SVGView.prototype.restore = function (ctn) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
        };
        SVGView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        SVGView.prototype.addEvents = function () {
            var self = this;
        };
        return SVGView;
    })();
    TripAssist.SVGView = SVGView;    
})(TripAssist || (TripAssist = {}));
