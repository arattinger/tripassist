describe('SVGView', function() {
    var app = null;
    var datamgr = null;
    var svgView = null;    

    beforeEach(function() {
        var user = {
            username: "test"
        };
        datamgr = new TripAssist.DataManager(user);
        app = null;
        svgView = new TripAssist.SVGView(datamgr, app);
    });

    it('test html', function(done) {
        datamgr.loadHoliday(1, function() {
            var ctn = document.getElementById('test-ctn');
            svgView.render(ctn, { title: 'filename', token: 'ac5a5ad88621adadf5f6' }, function() {
                expect( svgView.title() ).to.be('filename');
                window.setTimeout(function() {
                    expect( $('#svg-ctn').length ).not.to.be(0);
                    expect( $('#svg-ctn').get(0).innerHTML.length ).not.to.be(0);
                    done();    
                }, 300);
            });    
        });
    });
});
