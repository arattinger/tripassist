/// <reference path="view.ts" />
/// <reference path="../../lib/handlebars.d.ts" />
/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../templatemgr.ts" />
/// <reference path="../datamgr.ts" />
/// <reference path="../application.ts" />

module TripAssist {
    export class SelectHolidayView {

        private mainTemplate: any;
        private listTemplate: any;
        private listCtn: any;
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
            this.listTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview-list.template'));
            this.listCtn = null;
        }

        public title() {
            return "Select Holiday";
        }

        public name() {
            return "SelectHolidayView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            var offline_holidays = this.datamgr.getOfflineHolidays();
            ctn.innerHTML = this.mainTemplate({
                offline_holidays: offline_holidays
            });
            this.listCtn = $('.list-ctn');

            var self = this;
            function deleteHoliday(id) {
                console.log('TODO: remove offline holiday with id ' + id);
            }

            function downloadHoliday(id) {
                console.log('TODO: dowload holiday with id ' + id);
            }

            function openHoliday(id) {
                self.datamgr.loadHoliday(id, function() {
                    console.log('loading holiday with id ' + id);
                    self.app.loadView('MainView', self.datamgr.getOfflineHoliday(id));
                });
            }

            // add delete functionality
            $('.del-btn').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                deleteHoliday(id);
            });

            // add select functionality
            $('.label').on('tap', function() {
               var id = this.parentNode.getAttribute('data-id');
                openHoliday(id);
            });

            // TODO: allow swipe to remove/download item?

            // load online holidays
            function loadOnline() {
                self.datamgr.getOnlineHolidays(function(online_holidays) {
                    var html = self.listTemplate({
                        online_holidays : online_holidays
                    });
                    if (self.listCtn) {
                        self.listCtn.append(html);
                        // add delete functionality
                        $('.download-btn').on('tap', function() {
                            var id = this.parentNode.getAttribute('data-id');
                            downloadHoliday(id);
                        });

                    }
                }, function() {
                    // retry after interval
                    window.setTimeout(loadOnline, 3000);
                });
            }

            loadOnline();
        }

    }
}