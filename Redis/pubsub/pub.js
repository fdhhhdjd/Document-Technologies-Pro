const express = require("express");
const Redis = require("ioredis");

var redis = new Redis({
  port: 6379,
  host: "localhost",
});

const app = express();

const dataDummy = [
  {
    name: "Nguyen Tien Tai",
    age: 23,
  },
  {
    name: "Nguyen Tan Hao",
    age: 22,
  },
];

const pubMessage = () => {
  redis.publish("channel_name", JSON.stringify(dataDummy));
};

app.get("/", (req, res) => {
  console.log(`Sending message:`, req.body);
  pubMessage();
  return res.sendStatus(200);
});

app.listen(5000, () => console.log("web server is listening on port 5000"));