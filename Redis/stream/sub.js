const Redis = require("ioredis");

var redis = new Redis({
  port: 6379,
  host: "localhost",
});

const sub = async () => {
  while (1) {
    // read events from the beginning of stream 'events'
    const res = await redis.xread("BLOCK", 0, "STREAMS", "developer", "0");

    // parse the results (which are returned in quite a nested format)
    let events = res ? res[0][1] : [];
    events.length && console.log(`processing ${events.length} messages!`);

    for (var i = 0; i < events.length; i++) {
      let thisEvent = events[i];
      console.log("## id is ", thisEvent[0].toString());
      for (var eachKey in thisEvent[1]) {
        console.log(thisEvent[1][eachKey].toString());

        // remove the consumed message
        await redis.xdel("developer", thisEvent[0]);
      }
    }
  }
};

sub();
