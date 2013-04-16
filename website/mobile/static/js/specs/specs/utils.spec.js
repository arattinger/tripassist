describe('Utils', function() {

    var d;

    beforeEach(function() {
        d = new Date(2013, 3, 16, 14, 43, 0, 0);
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

});
