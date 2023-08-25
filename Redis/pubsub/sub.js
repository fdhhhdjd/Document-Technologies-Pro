const Redis = require("ioredis");

var redis = new Redis({
  port: 6379,
  host: "localhost",
});

const subMessage = () => {
  redis.subscribe("channel_name", (err, count) => {
    if (err) console.error(err.message);
    console.log(`Subscribed to ${count} channels.`);
  });

  redis.on("message", (channel, message) => {
    console.log(`Received message from ${channel}:`, JSON.parse(message));
  });
};

subMessage();
