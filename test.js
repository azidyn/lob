
const Book = require('./lob');

const test = require('ava');

const irand = range => ( Math.random() * range )<<0;

const random_book = ( side, levels, nonzero, min=0, max=999999999 ) => {

    let b = new Book(), p;

    for ( let t=0; t<levels; t++ )
        if ( side=='ask') {

            // Ensure we dont reinsert the same price twice
            // and thus book will result in exactly `levels` unique price levels
            
            for(;;) {
                p = Math.max( min, irand(10000) );
                p = Math.min( max, p );
                
                if ( b.peek('ask', p ) == null ) 
                    break;
            }

            b.ask( p, irand( 25 ) + ( nonzero ? 1 : 0 ) )

        } else  {

            for(;;) {
                p = Math.max( min, irand(10000) );
                p = Math.min( max, p );
                
                if ( b.peek('bid', p ) == null ) 
                    break;
            }
                        
            b.bid( p, irand( 25 ) + ( nonzero ? 1 : 0 ) )
        }

    return b;

}


test('bid correct number of levels', t => {
 
    let levels = 1000 + irand(1000);

    let b = random_book( 'bid', levels , true );

    let s = b.snapshot( levels * 2 );

    t.is( s.bid.length, levels );

    let s2 = b.snapshot( levels >> 1 );

    t.is( s2.bid.length, levels >> 1 );

    let s3 = b.snapshot( 1 );

    t.is( s3.bid.length, 1 );

    
});

test('ask correct number of levels', t => {
 
    let levels = 1000 + irand(1000);

    let b = random_book( 'ask', levels , true );

    let s = b.snapshot( levels * 2 );

    t.is( s.ask.length, levels );

    let s2 = b.snapshot( levels >> 1 );

    t.is( s2.ask.length, levels >> 1 );

    let s3 = b.snapshot( 1 );

    t.is( s3.ask.length, 1 );

    
});



test('bid desc sequential', t => {
 
    let levels = 1000 + irand(1000);

    let b = random_book( 'bid', levels , true );

    let s = b.snapshot( levels );

    for ( let i=0; i<s.bid.length-1; i++) {
        let l1 = s.bid[i], l2 = s.bid[i+1];

        // Bid prices should be in perfect descending order
        t.true( l1[0] > l2[0] );
    }

    
});


test('ask asc sequential', t => {
 
    let levels = 1000 + irand(1000);

    let b = random_book( 'ask', levels , true );

    let s = b.snapshot( levels );

    for ( let i=0; i<s.ask.length-1; i++) {
        let l1 = s.ask[i], l2 = s.ask[i+1];

        // Ask prices should be in perfect ascending order
        t.true( l1[0] < l2[0] );
    }

    
});


test('bid nonzero volume', t => {
 
    let levels = 1000 + irand(1000);

    let b = random_book( 'bid', levels , true );

    let s = b.snapshot( levels );

    t.true( s.bid.length > 0 );

    for ( let b of s.bid )
        t.true( b[1] != 0 )

    
});



test('ask nonzero volume', t => {
 
    let levels = 1000 + irand(1000);

    let b = random_book( 'ask', levels , true );

    let s = b.snapshot( levels );

    t.true( s.ask.length > 0 );

    for ( let b of s.ask )
        t.true( b[1] != 0 )

    
});


test('bid check quote', t => {
 
    let levels = 1000 + irand(1000);

    // 100 = bid prices are at between 100 and 10000
    let b = random_book( 'bid', levels , true, 100, 10000 );

    b.bid( 10001, 1 )

    let s = b.snapshot( 1 );

    t.true( s.bid[0][0] == 10001 && s.bid[0][1] == 1 );

   
});


test('ask check quote', t => {
 
    let levels = 1000 + irand(1000);

    // 100 = bid prices are at between 100 and 10000
    let b = random_book( 'ask', levels , true, 100, 10000 );

    b.ask( 99, 1 )

    let s = b.snapshot( 1 );

    t.true( s.ask[0][0] == 99 && s.ask[0][1] == 1 );

   
});


test('bid invalid inserts', t => {
 
    let levels = 1000 + irand(1000);

    // 100 = bid prices are at between 100 and 10000
    let b = random_book( 'bid', levels , true, 100, 10000 );

    // get best bid
    let s = b.snapshot( 1 );

    let best = s.bid[0];

    // set a ton of invalid best bids ( no volume )

    for ( let i=10001; i<11000; i+=2 ) {
        b.bid( i, 0 );
    }

    let s2 = b.snapshot( 1 );

    let best2 = s2.bid[0];

    t.true( best[0] == best2[0] && best[1] == best2[1] );

   
});


test('ask invalid inserts', t => {
 
    let levels = 1000 + irand(1000);

    // 100 = ask prices are between 100 and 10000
    let b = random_book( 'ask', levels , true, 100, 10000 );

    // get best ask
    let s = b.snapshot( 1 );

    let best = s.ask[0];

    // set a ton of invalid best asks (below quote with no volume )

    for ( let i=99; i>1; i-=2 ) {
        b.ask( i, 0 );
    }

    let s2 = b.snapshot( 1 );

    let best2 = s2.ask[0];

    t.true( best[0] == best2[0] && best[1] == best2[1] );

   
});




test('bid clear levels', t => {
 
    let levels = 1000 + irand(1000);

    // 100 = bid prices are at between 100 and 10000
    let b = random_book( 'bid', levels , true, 100, 10000 );

    // get best bid
    let s = b.snapshot( 1 );

    // Current best bid price
    let quote = s.bid[0][0];

    // remove a bunch of lower down bids:

    let c = 0;
    for ( let i=quote-1; i> 0; i -=2 ) {
        b.bid( i, 0 );
        if ( c++ > 100 ) break; // just a hundred will do!
    };


    // get best bid
    let s2 = b.snapshot( 1 );

    // Current best bid price
    let quote2 = s2.bid[0][0];

    t.true( quote == quote2 );

   
});



test('ask clear levels', t => {
 
    let levels = 1000 + irand(1000);

    // 100 = bid prices are at between 100 and 10000
    let b = random_book( 'ask', levels , true, 100, 10000 );

    // get best bid
    let s = b.snapshot( 1 );

    // Current best bid price
    let quote = s.ask[0][0];

    // remove a bunch of lower down bids:


    for ( let i=quote+1; i< quote+200; i +=2 ) {
        
        b.ask( i, 0 );
       
    };


    // get best bid
    let s2 = b.snapshot( 1 );

    // Current best bid price
    let quote2 = s2.ask[0][0];

    t.true( quote == quote2 );

   
});




test('bid one good many bad', t => {

    let b = new Book();

    // insert one good bid 
    b.bid( 900, 1 );

    // insert 10,000 no volume bids
    for ( let i=1; i< 10000; i++ ) {

        if ( i == 900 ) continue;

        b.bid( i, 0 );
    }

    let s = b.snapshot( 1 );

    t.true( s.bid.length == 1 )

    t.true( s.bid[0][0] == 900 && s.bid[0][1] == 1 )
   
});


test('ask one good many bad', t => {

    let b = new Book();

    // insert one good bid 
    b.ask( 900, 1 );

    // insert 10,000 no volume bids
    for ( let i=1; i< 10000; i++ ) {

        if ( i == 900 ) continue;

        b.ask( i, 0 );
    }

    let s = b.snapshot( 1 );

    t.true( s.ask.length == 1 )

    t.true( s.ask[0][0] == 900 && s.ask[0][1] == 1 )
   
});