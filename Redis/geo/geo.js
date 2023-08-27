const express = require('express');
const Redis = require('ioredis');

const redis = new Redis({
    port: 6379,
    host: 'localhost',
});

const app = express();

const keyStore = 'stores';

const storeLocations = [
    { name: 'Store A', longitude: -122.419416, latitude: 37.774929 }, // San Francisco
    { name: 'Store B', longitude: 2.352222, latitude: 48.856613 }, // Paris
    { name: 'Store C', longitude: -74.006, latitude: 40.7128 }, // New York
];

app.get('/', (req, res) => {
    console.info(`Add Geo Redis:::`);

    // Add Geo data for every store
    // Thêm dữ liệu GEO cho từng cửa hàng
    storeLocations.forEach((store) => {
        redis.geoadd(keyStore, store.longitude, store.latitude, store.name);
    });

    return res.sendStatus(200);
});

// Find store near based location of user
// Tìm cửa hàng gần nhất dựa trên vị trí người dùng
const userLongitude = -122.419416;
const userLatitude = 37.774929;
const searchRadius = 10000; // 10,000 km

// Option "WITHCOORD" get info lat and long of store
// Option "WITHHASH" get info hash of store
// Option "COUNT" get store near much

// Tùy chọn "WITHCOORD" để lấy cả thông tin về kinh độ và vĩ độ của cửa hàng
// Tùy chọn "WITHHASH" để lấy giá trị hash của cửa hàng
// Tùy chọn "COUNT" để lấy nhiều cửa hàng gần nhất (ở đây là 3 cửa hàng)

app.get('/info', async (req, res) => {
    console.info(`Add Geo Redis:::`);

    const resultGeo = await redis.georadius(
        keyStore,
        userLongitude,
        userLatitude,
        searchRadius,
        'km',
        'WITHDIST',
        'WITHCOORD',
        'WITHHASH',
        'DESC',
        'COUNT',
        5,
        (err, result) => {
            if (err) {
                console.error('Error finding nearby store:', err);
                return err;
            } else {
                const nearestStore = result[0];
                console.info(
                    'Nearest store:',
                    nearestStore[0],
                    'Distance:',
                    nearestStore[1],
                    'km',
                );
                return nearestStore;
            }
        },
    );
    return res.status(200).json({
        status: 200,
        msg: resultGeo,
    });
});

app.listen(5000, () => console.info('web server is listening on port 5000'));
