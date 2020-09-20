

const Book = require('./lob');

let b = new Book();

// Add asks
// price, size 
b.ask(1000, 1 );
b.ask(1010, 2 );
b.ask(999, 3 );
b.ask(1200, 4 );

// add some bids
b.bid( 998, 4 );
b.bid( 100, 3 );
b.bid( 997, 2 );
b.bid( 900, 1 );

// Remove all bids at price 900
b.bid( 900, 0 );

// Add a new bid at 800
b.bid( 800, 5 )

// Read the bid at price 997
// Data is returned in a 2d array [ price, size ]
let bid = b.peek( 'bid', 997 )

console.log(`Bid size at ${bid[0]} is ${bid[1]} `);

let snapshot = b.snapshot( 10 ); // max 10 levels

// `snapshot.bid` => bids sorted by best bid first (price descending)
// `snapshot.ask` => asks sorted by best ask first (price ascending)

console.log( snapshot );