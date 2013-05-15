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
        private datamgr: TripAssist.DataManager;
        private app: TripAssist.Application;
        private stored: bool;
        private storedHTML: string;
        private currentCtn: HTMLElement;

        constructor(datamgr : TripAssist.DataManager, app: TripAssist.Application) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
            this.listTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview-list.template'));
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }

        public title() {
            return "Select Holiday";
        }

        public name() {
            return "SelectHolidayView";
        }

        public render(ctn: HTMLElement, data: any, callback: () => any) {
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
                
            });

            this.addEvents();
            this.loadOnlineHolidays($('.list-ctn'));
            this.loadOfflineHolidays($('.list-ctn'));

            callback();
        }


        public store() {
            this.stored = true;
            if (this.currentCtn)
                this.storedHTML = this.currentCtn.innerHTML;
        }

        public restore(ctn: HTMLElement) : bool {
            if (!this.stored) return false;
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            this.loadOnlineHolidays($('.list-ctn'));
            return true;
        }

        public unload() {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        }

        private addEvents() {
            var self = this;
            // TODO: allow swipe to remove/download item?
            function deleteHoliday(id) {
                console.log('TODO: remove offline holiday with id ' + id);
            }

            function downloadHoliday(id) {
                console.log('TODO: dowload holiday with id ' + id);
            }

            function openHoliday(id) {
                self.datamgr.loadHoliday(id, function() {
                    self.app.loadView('MainView', self.datamgr.getOfflineHoliday(id));
                });
            }

            // add delete functionality
            $('.del-btn').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                deleteHoliday(id);
                return false;
            });

            // add select functionality
            $('.label').on('tap', function() {
               var id = this.parentNode.getAttribute('data-id');
                openHoliday(id);
                return false;
            });

            // add delete functionality
            $('.download-btn').on('tap', function() {
                var id = this.parentNode.getAttribute('data-id');
                downloadHoliday(id);
                return false;
            });
        }

        private loadOnlineHolidays(ctn : any) {
            // load online holidays
            var self = this;
            function loadOnline() {
                self.datamgr.getOnlineHolidays(function(online_holidays) {
                    if (!self.stored) {
                        var previousList = $('#online-holidays-list');
                        if (previousList) { // attach to list
                            previousList.empty();
                            var html = "";
                            for (var i = 0; i<online_holidays.length; i++) {
                                html += "<li data-id='" + online_holidays[i].id + "'>\n"
                                     +  "    <div class='label'>" + online_holidays[i].name + "'\n"
                                     +  "    <div class='download-btn'></div>";
                            }
                            previousList.html(html);
                        } else { // create new list
                            var html = self.listTemplate({
                                title: 'Online',
                                id: 'online-holidays-list',
                                offline: false,
                                holidays : online_holidays
                            });
                            
                            ctn.append(html);
                        }
                        self.addEvents();
                    }
                }, function() {
                    // retry after timeout
                    if (!self.stored)
                        window.setTimeout(loadOnline, 3000);
                });
            }
            loadOnline();
        }

        private loadOfflineHolidays(ctn : any) {
            // load online holidays
            var self = this;
            function loadOffline() {
                self.datamgr.getOfflineHolidays(function(holidays) {
                    if (!self.stored) {
                        var previousList = $('#offline-holidays-list');
                        if (previousList.length) { // attach to list
                            previousList.empty();
                            var html = "";
                            for (var i = 0; i<holidays.length; i++) {
                                html += "<li data-id='" + holidays[i].id + "'>\n"
                                     +  "    <div class='label'>" + holidays[i].name + "'\n"
                                     +  "    <div class='download-btn'></div>";
                            }
                            previousList.html(html);
                        } else { // create new list
                            var html = self.listTemplate({
                                title: 'Offline',
                                offline: true,
                                id: 'offline-holidays-list',
                                holidays : holidays
                            });
                            
                            ctn.append(html);
                        }
                        self.addEvents();
                    }
                }, function() {
                    // retry after timeout
                    if (!self.stored)
                        window.setTimeout(loadOffline, 3000);
                });
            }
            loadOffline();
        }
    }
}