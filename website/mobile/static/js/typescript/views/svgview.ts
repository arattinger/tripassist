/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />

module TripAssist {
    
    export interface SVGItem {
        title?: string;
        token?: string;
    }

    export class SVGView {

        private mainTemplate: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;
        private title_: string;
        private currentZoom_: number;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('svgview.template'), {noEscape: true});
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
            this.title_ = 'Route';
            this.currentZoom_ = 1.0;
        }

        public title() {
            return this.title_;
        }

        public name() {
            return "SVGView";
        }

        public render(ctn: HTMLElement, data: SVGItem, callback: () => any) {
            this.title_ = data.title;
            this.currentCtn = ctn;

            var self = this;

            $.ajax(this.datamgr.getAttachmentUrl(data.token, '.svg'), {
                dataType: 'text', // otherwise xml will be returned
                success: function(svg) {
                    ctn.innerHTML = '<div style="background:white; overflow:auto; width:100%;height:100%">' + svg + '</div>';
                    self.addEvents();
                    self.setZoomable();
                    callback();
                }
            });
        }

        public store() {
        this.stored = true;
        if (this.currentCtn)
            this.storedHTML = this.currentCtn.innerHTML;
        this.unsetZoomable();
        }

        public restore(ctn: HTMLElement) {
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            this.setZoomable();
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
            this.unsetZoomable();
        }

        private addEvents() {
            var self = this;

            function scale(level) {
                $('#svg-ctn').css('transform', 'scale('+level+','+level+')');
                $('#svg-ctn').css('-ms-transform', 'scale('+level+','+level+')');
                $('#svg-ctn').css('-webkit-transform', 'scale('+level+','+level+')');
                $('#svg-ctn').css('transform-origin', 'left top');
                $('#svg-ctn').css('-ms-transform-origin', 'left top');
                $('#svg-ctn').css('-webkit-transform-origin', 'left top');
            }

            /*// make svg zoomable
            $("#svg-ctn").swipe( {
                pinchIn: function(event, direction, distance, duration, fingerCount, pinchZoom)
                {
                    alert('open');
                    //self.currentCtn.innerHTML = "this was pinch";
                    self.currentZoom_ += 0.5;
                    scale(self.currentZoom_);
                },
                pinchOut:function(event, direction, distance, duration, fingerCount, pinchZoom)
                {
                    self.currentZoom_ -= 0.5;
                    scale(self.currentZoom_);
                },
                fingers:2,  
                pinchThreshold:0    
            });*/
        }

        private setZoomable() {
            // prevent scrolling on content by setting overflow to hidden
            $('#content-ctn').css('overflow', 'hidden');
        }

        private unsetZoomable() {
            $('#content-ctn').css('overflow', 'auto');
        }

    }
}