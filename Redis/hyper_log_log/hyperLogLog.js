const express = require('express');
const Redis = require('ioredis');

const redis = new Redis({
    port: 6379,
    host: 'localhost',
});

const app = express();

const key = 'event_registrations';

// Danh sách tên người đăng ký
const registeredUsers = [
    'user1',
    'user2',
    'user3',
    'user4',
    'user1',
    'user5',
    'user6',
];
app.get('/', async (req, res) => {
    // Sử dụng HyperLogLog để ước tính số lượng người đăng ký duy nhất
    const result = await redis.pfadd(key, ...registeredUsers);
    return res.status(200).json({
        status: 200,
        msg: result,
    });
});

app.get('/info', async (req, res) => {
    // Ước tính số lượng người tham gia sự kiện
    const resultEvent = await redis.pfcount(key);
    const dataType = await redis.type(key);

    return res.status(200).json({
        status: 200,
        msg: {
            result: resultEvent,
            typeRedis: dataType,
        },
    });
});

app.listen(5000, () => console.info('web server is listening on port 5000'));
