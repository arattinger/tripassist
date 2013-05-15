describe('Utils', function() {

    var d;

    beforeEach(function() {
        d = new Date(2013, 3, 16, 14, 43, 0, 0);
    });

    it('test diff in words now', function() {
        expect( d.diffInWords(new Date(2013, 3, 16, 14, 43, 12, 0)) ).to.be('Now');
    });

    it('test diff in words one minute ago', function() {
        expect( d.diffInWords(new Date(2013, 3, 16, 14, 44, 12, 0)) ).to.be('about one minute ago');
    });

    it('test diff in words 4 minutes ago', function() {
        expect( d.diffInWords(new Date(2013, 3, 16, 14, 47, 12, 0)) ).to.be('about 4 minutes ago');
    });

    it('test diff in words 2 hours from now', function() {
        expect( d.diffInWords(new Date(2013, 3, 16, 12, 47, 12, 0)) ).to.be('about 2 hours from now');
    });

    it('test date format %a', function() {
        expect( d.format('%a') ).to.be('Tue');
    });

    it('test date format %A', function() {
        expect( d.format('%A') ).to.be('Tuesday');
    });

    it('test date format %b', function() {
        expect( d.format('%b') ).to.be('Apr');
    });

    it('test date format %B', function() {
        expect( d.format('%B') ).to.be('April');
    });

    it('test date format %c', function() {
        expect( d.format('%c') ).to.be('Tue Apr 16 14:43:00 2013');
    });

    it('test date format %d', function() {
        expect( d.format('%d') ).to.be('16');
    });

    it('test date format %e', function() {
        expect( d.format('%e') ).to.be('16');
    });

    it('test date format %H', function() {
        expect( d.format('%H') ).to.be('14');
    });

    it('test date format %I', function() {
        expect( d.format('%I') ).to.be('02');
    });

    it('test date format %k', function() {
        expect( d.format('%k') ).to.be('14');
    });

    it('test date format %l', function() {
        expect( d.format('%l') ).to.be(' 2');
    });

    it('test date format %L', function() {
        expect( d.format('%L') ).to.be('000');
    });

    it('test date format %m', function() {
        expect( d.format('%m') ).to.be('04');
    });

    it('test date format %M', function() {
        expect( d.format('%M') ).to.be('43');
    });

    it('test date format %o', function() {
        expect( d.format('%o') ).to.be('th');
    });

    it('test date format %p', function() {
        expect( d.format('%p') ).to.be('pm');
    });

    it('test date format %s', function() {
        expect( d.format('%s') ).to.be(d.getTime() / 1000 + '');
    });

    it('test date format %S', function() {
        expect( d.format('%S') ).to.be('00');
    });

    it('test date format %T', function() {
        expect( d.format('%T') ).to.be('14:43:00');
    });

    it('test date format %w', function() {
        expect( d.format('%w') ).to.be('16');
    });

    it('test date format %y', function() {
        expect( d.format('%y') ).to.be('13');
    });

    it('test date format %Y', function() {
        expect( d.format('%Y') ).to.be('2013');
    });

    it('test angle in words N', function() {
        expect ( Utils.angleInWords(0) ).to.be('N');
    });

    it('test angle in words NE', function() {
        expect ( Utils.angleInWords(45) ).to.be('NE');
    });

    it('test angle in words E', function() {
        expect ( Utils.angleInWords(90) ).to.be('E');
    });

    it('test angle in words SE', function() {
        expect ( Utils.angleInWords(124) ).to.be('SE');
    });

    it('test angle in words S', function() {
        expect ( Utils.angleInWords(170) ).to.be('S');
    });

    it('test angle in words SW', function() {
        expect ( Utils.angleInWords(220) ).to.be('SW');
    });

    it('test angle in words W', function() {
        expect ( Utils.angleInWords(275) ).to.be('W');
    });

    it('test angle in words NW', function() {
        expect ( Utils.angleInWords(300) ).to.be('NW');
    });

    it('test direction in degrees', function() {
        var pos1 = {
            longitude: 15.13,
            latitude: 47.12
        };

        var pos2 = {
            longitude: 15.12,
            latitude: 46.99
        };
        expect ( Math.round(Utils.directionInDeg(pos1, pos2)) ).to.be(183);
    });

    it('test direction in degrees 2', function() {
        var pos1 = {
            longitude: 15.433871,
            latitude: 47.070644
        };

        var pos2 = {
            longitude: 15.437486,
            latitude: 47.073943
        };
        expect ( Math.round(Utils.directionInDeg(pos1, pos2)) ).to.be(37);
    });

});
