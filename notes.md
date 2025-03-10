IN NON LINK MODE

when playing
-video element calls onTimeUpdate
--this sets currentTime
--currentTime sets clockTime
--clockTime is reflected in slider and clock
--video.currentTime IS NOT set by clockTime because doSeek is false

when seeking
-control calls onSeek
--onSeek sets currentTime and doSeek
--currentTime sets clockTime
--clockTime is reflected in slider and clock
--video.currentTime IS set by clockTime because doSeek is true, which updates the position of the video



IN LINK MODE

when playing
-video element 0 calls onTimeUpdate
--this sets currentTime
--currentTime sets clockTime
--clockTime is reflected in slider and clock
--video.currentTime IS NOT set by clockTime because doSeek is false

when seeking
-control calls onSeek
--onSeek sets currentTime and doSeek
--currentTime sets clockTime
--clockTime is reflected in slider and clock
--video.currentTime IS set by clockTime because doSeek is true, which updates the position of the video




ways that current time can change
seek button = current time + seek interval
other player seek button = current time + seek interval + link interval

slider = actual time of slider
other slider = actual time + link interval

loop = loop restarts
other loop = loop restarts + link interval ACTUALLY THIS SHOULD BE TAKENN CARE OF BY OTHER PLAYER

other player = actual time of other player + link interval





## LOOPING IN LINK MODE

What only one player could have looping on at a time.
That player would use the bookmarks to loop, and the other player would disregard its bookmarks
The start and end of both players would need to be factored into the start and end of the loop (perhaps display these on the slider)




