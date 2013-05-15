var TripAssist;
(function (TripAssist) {
    var SelectHolidayView = (function () {
        function SelectHolidayView(datamgr, app) {
            this.datamgr = datamgr;
            this.app = app;
            this.mainTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview.template'));
            this.listTemplate = Handlebars.compile(TemplateManager.getTemplate('selectholidayview-list.template'));
            this.stored = false;
            this.storedHTML = "";
            this.currentCtn = null;
        }
        SelectHolidayView.prototype.title = function () {
            return "select holiday";
        };
        SelectHolidayView.prototype.name = function () {
            return "SelectHolidayView";
        };
        SelectHolidayView.prototype.render = function (ctn, data, callback) {
            this.currentCtn = ctn;
            ctn.innerHTML = this.mainTemplate({
            });
            this.addEvents();
            this.loadOnlineHolidays($('.list-ctn'));
            this.loadOfflineHolidays($('.list-ctn'));
            callback();
        };
        SelectHolidayView.prototype.store = function () {
            this.stored = true;
            if(this.currentCtn) {
                this.storedHTML = this.currentCtn.innerHTML;
            }
        };
        SelectHolidayView.prototype.restore = function (ctn) {
            if(!this.stored) {
                return false;
            }
            this.stored = false;
            ctn.innerHTML = this.storedHTML;
            this.addEvents();
            this.loadOnlineHolidays($('.list-ctn'));
            return true;
        };
        SelectHolidayView.prototype.unload = function () {
            this.stored = false;
            this.storedHTML = null;
            this.currentCtn = null;
        };
        SelectHolidayView.prototype.addEvents = function () {
            var self = this;
            function deleteHoliday(id) {
                console.log('TODO: remove offline holiday with id ' + id);
            }
            function downloadHoliday(id) {
                console.log('TODO: dowload holiday with id ' + id);
            }
            function openHoliday(id) {
                self.datamgr.loadHoliday(id, function () {
                    self.app.loadView('MainView', self.datamgr.getOfflineHoliday(id));
                });
            }
            $('.del-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                deleteHoliday(id);
                return false;
            });
            $('.label').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                openHoliday(id);
                return false;
            });
            $('.download-btn').on('tap', function () {
                var id = this.parentNode.getAttribute('data-id');
                downloadHoliday(id);
                return false;
            });
        };
        SelectHolidayView.prototype.loadOnlineHolidays = function (ctn) {
            var self = this;
            function loadOnline() {
                self.datamgr.getOnlineHolidays(function (online_holidays) {
                    if(!self.stored) {
                        var previousList = $('#online-holidays-list');
                        if(previousList) {
                            previousList.empty();
                            var html = "";
                            for(var i = 0; i < online_holidays.length; i++) {
                                html += "<li data-id='" + online_holidays[i].id + "'>\n" + "    <div class='label'>" + online_holidays[i].name + "'\n" + "    <div class='download-btn'></div>";
                            }
                            previousList.html(html);
                        } else {
                            var html = self.listTemplate({
                                title: 'ONLINE',
                                id: 'online-holidays-list',
                                offline: false,
                                holidays: online_holidays
                            });
                            ctn.append(html);
                        }
                        self.addEvents();
                    }
                }, function () {
                    if(!self.stored) {
                        window.setTimeout(loadOnline, 3000);
                    }
                });
            }
            loadOnline();
        };
        SelectHolidayView.prototype.loadOfflineHolidays = function (ctn) {
            var self = this;
            function loadOffline() {
                self.datamgr.getOfflineHolidays(function (holidays) {
                    if(!self.stored) {
                        var previousList = $('#offline-holidays-list');
                        if(previousList.length) {
                            previousList.empty();
                            var html = "";
                            for(var i = 0; i < holidays.length; i++) {
                                html += "<li data-id='" + holidays[i].id + "'>\n" + "    <div class='label'>" + holidays[i].name + "'\n" + "    <div class='download-btn'></div>";
                            }
                            previousList.html(html);
                        } else {
                            var html = self.listTemplate({
                                title: 'OFFLINE',
                                offline: true,
                                id: 'offline-holidays-list',
                                holidays: holidays
                            });
                            ctn.append(html);
                        }
                        self.addEvents();
                    }
                }, function () {
                    if(!self.stored) {
                        window.setTimeout(loadOffline, 3000);
                    }
                });
            }
            loadOffline();
        };
        return SelectHolidayView;
    })();
    TripAssist.SelectHolidayView = SelectHolidayView;    
})(TripAssist || (TripAssist = {}));
