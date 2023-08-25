const Redis = require("ioredis");

var redis = new Redis({
  port: 6379,
  host: "localhost",
});

async function pub() {
  // write an event to stream 'events', setting 'key1' to 'value1'
  await redis.sendCommand(
    new Redis.Command("XADD", ["developer", "*", "Tai Dev", "Coder"])
  );

  redis.disconnect();
}

pub();
