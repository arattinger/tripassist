describe('Application', function() {
    var app;

    beforeEach(function() {
        app = new TripAssist.Application();
    });

    it('main container filled', function() {
        expect ( $('#main-ctn').html().length ).to.be(0);
        app.start();
        expect ( $('#main-ctn').html().length ).not.to.be(0);
    });

    it('selectholidayview loaded initially', function() {
        app.start();
        expect ( $('#title').text() ).to.be('Select Holiday');
    });

});
