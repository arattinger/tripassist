var mockWindowOpenUrl = null;
var mockWindowOpenTarget = null;

window.open = function(url, target) {
    mockWindowOpenUrl = url;
    mockWindowOpenTarget = target;
};


describe('AccommodationDetailView', function() {
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
        detailView = new TripAssist.AccommodationDetailView(datamgr, app);
    });

    it('test data', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getAccommodation(1), function() {
                expect( $('.detail-info-ctn').get(0).innerHTML ).to.be('From May 29<sup>th</sup> to May 30<sup>th</sup> (1 night)');
                expect( $('.detail-info-ctn').get(1).innerHTML ).to.be('Rue du poisson 53, Nice');
                expect( $('.detail-info-ctn').get(2).innerHTML ).to.be('http://www.hoteldamour.fr');
                expect( $('.detail-info-ctn').get(3).innerHTML ).to.be('office@hoteldamour.fr');
                expect( $('.detail-info-ctn').get(4).innerHTML ).to.be('+51 7568566');
                expect( $('.label').get(0).innerHTML ).to.be('Hotel reservation.pdf');
                done();
            });    
        });
    });

    it('test navigation', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getAccommodation(1), function() {
                $('#navigate-btn').trigger('tap');
                expect( app.loadedName ).to.be('NavigationView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.name ).to.be("Hotel d'Amour");
                expect( app.loadedData.longitude ).to.be(47.13);
                expect( app.loadedData.latitude ).to.be(16.45);
                done();
            });    
        });
    });

    it('test attachment', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getAccommodation(1), function() {
                $('.label').trigger('tap');
                expect( app.loadedName ).to.be('SVGView');
                expect( app.loadedData ).not.to.be(null);
                expect( app.loadedData.title ).to.be('Hotel reservation.pdf');
                expect( app.loadedData.token ).to.be('adil920askd72ald82af');
                done();
            });    
        });
    });

    it('test web', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getAccommodation(1), function() {
                $($('.detail-info-ctn').get(2)).trigger('taphold');
                expect( mockWindowOpenUrl ).to.be('http://www.hoteldamour.fr');
                expect( mockWindowOpenTarget ).to.be('_blank');
                done();
            });    
        });
    });

    it('test email', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getAccommodation(1), function() {
                $($('.detail-info-ctn').get(3)).trigger('taphold');
                expect( mockWindowOpenUrl ).to.be('mailto:office@hoteldamour.fr');
                expect( mockWindowOpenTarget ).to.be('link-target');
                done();
            });    
        });
    });

    it('test phone', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            detailView.render(ctn, datamgr.getAccommodation(1), function() {
                $($('.detail-info-ctn').get(4)).trigger('taphold');
                expect( mockWindowOpenUrl ).to.be('tel:+517568566');
                expect( mockWindowOpenTarget ).to.be('link-target');
                done();
            });    
        });
    });
});
