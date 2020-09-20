# lob
simple limit order book management solution in O(log n)

Note: this code assumes absolute figues, not relative. So when you set a bid/ask at price, whatever size is currently
at that price will be overwritten. It is trivial to modify this code to work with deltas instead. 

See example.js for usage