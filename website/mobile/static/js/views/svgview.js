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
            this.currentZoom_ = 1.0;
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
            var self = this;
            ctn.innerHTML = "loading...";
            $.ajax(this.datamgr.getAttachmentUrl(data.token, '.svg'), {
                dataType: 'text',
                success: function (svg) {
                    ctn.innerHTML = '<div id="svg-ctn">' + svg + '</div>';
                    self.addEvents();
                    self.setZoomable();
                }
            });
            callback();
        };
        SVGView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
            this.unsetZoomable();
        };
        SVGView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            this.setZoomable();
            return true;
        };
        SVGView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.unsetZoomable();
        };
        SVGView.prototype.addEvents = function () {
            var self = this;
            function scale(level) {
                $('#svg-ctn').css('transform', 'scale(' + level + ',' + level + ')');
                $('#svg-ctn').css('-ms-transform', 'scale(' + level + ',' + level + ')');
                $('#svg-ctn').css('-webkit-transform', 'scale(' + level + ',' + level + ')');
                $('#svg-ctn').css('transform-origin', 'left top');
                $('#svg-ctn').css('-ms-transform-origin', 'left top');
                $('#svg-ctn').css('-webkit-transform-origin', 'left top');
            }
        };
        SVGView.prototype.setZoomable = function () {
            $('#content-ctn').css('overflow', 'hidden');
        };
        SVGView.prototype.unsetZoomable = function () {
            $('#content-ctn').css('overflow', 'auto');
        };
        return SVGView;
    })();
    TripAssist.SVGView = SVGView;    
})(TripAssist || (TripAssist = {}));
