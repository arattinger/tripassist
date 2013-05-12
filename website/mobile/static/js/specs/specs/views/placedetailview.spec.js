// window.open is overwritten in accommodationsdetailview.spec.js

describe('PlaceDetailView', function() {
    var app = null;
    var datamgr = null;
    var detailView = null;

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager(user);
        app = {
            loadedName: null,
            loadedData: null,

            loadView: function(name, data) {
                this.loadedName = name;
                this.loadedData = data;
            }
        };
        detailView = new TripAssist.PlaceDetailView(datamgr, app);
    });

    it('test data', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getPlace(3), function() {
                expect( $('.detail-info-ctn').get(0).innerHTML ).to.be('Via Castorale 7, Venezia');
                expect( $('.detail-info-ctn').get(1).innerHTML ).to.be('http://www.milanovenezia.it');
                expect( $('.detail-info-ctn').get(2).innerHTML ).to.be('ristorante@milanovenezia.it');
                expect( $('.detail-info-ctn').get(3).innerHTML ).to.be('+32 (0) 7568566');
                expect( $('.attachments .label').get(0).innerHTML ).to.be('DSC753245.jpg');
                done();
            });    
        });
    });

    it('test navigation', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getPlace(3), function() {
                $('#navigate-btn').trigger('tap');
                expect( app.loadedName ).to.be('NavigationView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.name ).to.be("Ristorante Milano");
                expect( app.loadedData.longitude ).to.be(47.13);
                expect( app.loadedData.latitude ).to.be(16.45);
                done();
            });    
        });
    });

    it('test attachment', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getPlace(3), function() {
                $('.label').trigger('tap');
                expect( app.loadedName ).to.be('SVGView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.title ).to.be('DSC753245.jpg');
                expect( app.loadedData.token ).to.be('ad92ad9adl8adli2laso');
                done();
            });    
        });
    });

    it('test web', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getPlace(3), function() {
                $($('.detail-info-ctn').get(1)).trigger('taphold');
                expect( mockWindowOpenUrl ).to.be('http://www.milanovenezia.it');
                expect( mockWindowOpenTarget ).to.be('_blank');
                done();
            });    
        });
    });

    it('test email', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getPlace(3), function() {
                $($('.detail-info-ctn').get(2)).trigger('taphold');
                expect( mockWindowOpenUrl ).to.be('mailto:ristorante@milanovenezia.it');
                expect( mockWindowOpenTarget ).to.be('link-target');
                done();
            });    
        });
    });

    it('test phone', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getPlace(3), function() {
                $($('.detail-info-ctn').get(3)).trigger('taphold');
                expect( mockWindowOpenUrl ).to.be('tel:+3207568566');
                expect( mockWindowOpenTarget ).to.be('link-target');
                done();
            });    
        });
    });
});
