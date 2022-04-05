# Stuff to do
- standardize on button push, state notification to/from processor syntax and methodoloby
    - so something along the lines of
        send to processor { "command": "room.vol[program].up()" }
        see link about resolving strings to methods https://stackoverflow.com/questions/540066/calling-a-function-from-a-string-in-c-sharp

        redceive from processor { "object": "/room/vol/program/level", "value": 50 }
        not sure yet how to resolve json into component values

- logging context still needs to be worked out and/or tested.
- a catch all error or exception to be logged back to the processor maybe a catch in the app.module?

# Lessons Learned
- it is possible to run the local served up web page against the processor
    - no more uploading to the processor, for the processor to host the web page and testing
    - this method is good only for debugging and not entirely accurate when ran on the processor or when running on a TSW1060.
    - the xpanel confighuration must contain the IP address of the processor (not 127.0.0.1) see ./src/app.module.ts

- processor communication
    - we will not use joins for every components, or html elements.
    - We will use JSON packaging sent over serial joins.
    - see ./Config/StaticJoinNumbers.ts for the dedicated joins
    - we will use reserved joins on the touch panel to monitor online/offline

- logging
    - currently tried to log directly from TSW1060 to a locally hosted SEQ server, but it didnt work
      same code hosted on local computer usig ng server or the NPM script "start", does work.
      the same code hosted on the processor also does not log to the SEQ server.

- sending data from the processor
    - data sent by the processor to the touch panel via serial join
    - sending the config file which is about 30kb, cannot happen blindly. the touchpanel HTML receives the data but it is out of sequence if it is sent all at once.
    - only about 1kb is received at any given time; however it is also not sequential.
    - right now on the processor side there is a ~100ms delay per chunk that needs to be sent over with a header and tail signifying the start and end of the package.
