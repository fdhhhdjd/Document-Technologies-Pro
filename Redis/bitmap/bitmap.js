const Redis = require('ioredis');

const redis = new Redis({
    port: 6379,
    host: 'localhost',
});

const userOnlineKey = 'user:online:20230827'; // Tên khóa bitmap cho người dùng trực tuyến ngày 2023-08-27

async function markUserOnline(userId) {
    await redis.setbit(userOnlineKey, userId, 1);
}

// Đánh dấu người dùng vắng mặt (bit ở vị trí 0) trong bitmap
async function markUserOffline(userId) {
    await redis.setbit(userOnlineKey, userId, 0);
}

// Kiểm tra xem người dùng có mặt hay vắng mặt trong bitmap
async function checkUserStatus(userId) {
    const isOnline = await redis.getbit(userOnlineKey, userId);
    return isOnline === 1 ? 'Online' : 'Offline';
}

// Đếm số lượng người dùng online từ bitmap 1
async function countUsersOnline() {
    const count = await redis.bitcount(userOnlineKey);
    return count;
}

const handleRunCheck = async () => {
    await markUserOnline(123);
    await markUserOnline(456);
    await markUserOffline(123);
    await markUserOnline(789);
    await markUserOffline(91011);
    await markUserOffline(111);

    console.info('User 123:', await checkUserStatus(123)); // Xuất ra "Offline"
    console.info('User 456:', await checkUserStatus(456)); // Xuất ra "Online"
    console.info('User 789:', await checkUserStatus(456)); // Xuất ra "Online"
    console.info('User 91011:', await checkUserStatus(91011)); // Xuất ra "Offline"
    console.info('User 111:', await checkUserStatus(111)); // Xuất ra "Online"

    console.info('Total users online:', await countUsersOnline());

    redis.quit();
};

handleRunCheck();
