const Redis = require('ioredis');

const redis = new Redis({
    port: 6379,
    host: 'localhost',
});

// Key status contain and count message user
// Khóa chứa thông tin trạng thái và số lượng tin nhắn của người dùng
function getUserKey(userId) {
    return `user:${userId}`;
}

// User markup online at position 1 in bitmap and increment count message times 1
// Đánh dấu người dùng trực tuyến và tăng số lượng tin nhắn gửi đi
async function markUserOnlineAndIncrementMessages(userId) {
    const userKey = getUserKey(userId);
    await redis
        .multi()
        .setbit(userKey, 0, 1) // Bit 0: Trạng thái trực tuyến
        .incr(userKey + ':messages') // Tăng số lượng tin nhắn gửi đi
        .exec();
}

// User markup offline at position 0 in bitmap
// Đánh dấu người dùng offline
async function markUserOffline(userId) {
    const userKey = getUserKey(userId);
    await redis.setbit(userKey, 0, 0); // Bit 0: Trạng thái offline
}

// Get info status and count message user
// Lấy thông tin về trạng thái và số lượng tin nhắn của người dùng
async function getUserInfo(userId) {
    const userKey = getUserKey(userId);
    const results = await redis
        .multi()
        .getbit(userKey, 0) // Bit 0: Trạng thái trực tuyến
        .get(userKey + ':messages') // Lấy số lượng tin nhắn
        .exec();

    const onlineStatus = results[0][1];
    const messageCount = results[1][1];

    const status = onlineStatus === 1 ? 'Online' : 'Offline';

    return {
        status: status,
        messages: messageCount ? parseInt(messageCount) : 0,
    };
}

// Mô phỏng hoạt động của ứng dụng
async function simulateChatApp() {
    await markUserOnlineAndIncrementMessages(123);
    await markUserOnlineAndIncrementMessages(456);
    await markUserOffline(789);
    await markUserOffline(123);

    console.info('User 123:', await getUserInfo(123)); // Xuất ra { status: 'Offline', messages: 1 }
    console.info('User 456:', await getUserInfo(456)); // Xuất ra { status: 'Online', messages: 1 }
    console.info('User 789:', await getUserInfo(789)); // Xuất ra { status: 'Offline', messages: 1 }
}

simulateChatApp().finally(() => {
    redis.quit();
});
