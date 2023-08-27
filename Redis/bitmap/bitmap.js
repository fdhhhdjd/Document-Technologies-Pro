const Redis = require('ioredis');

const redis = new Redis({
    port: 6379,
    host: 'localhost',
});

// key name  for user online date 2023-08-27
// Tên khóa bitmap cho người dùng trực tuyến ngày 2023-08-27
const userOnlineKey = 'user:online:20230827';

// User markup online at position 1 in bitmap
// Đánh dấu người dùng đang hoạt động (bit ở vị trí 0) trong bitmap
async function markUserOnline(userId) {
    await redis.setbit(userOnlineKey, userId, 1);
}

// User markup offline at position 0 in bitmap
// Đánh dấu người dùng vắng mặt (bit ở vị trí 0) trong bitmap
async function markUserOffline(userId) {
    await redis.setbit(userOnlineKey, userId, 0);
}

// Check user have off or online in bitmap
// Kiểm tra xem người dùng có mặt hay vắng mặt trong bitmap
async function checkUserStatus(userId) {
    const isOnline = await redis.getbit(userOnlineKey, userId);
    return isOnline === 1 ? 'Online' : 'Offline';
}

// Count user online in bitmap ( note: bitcount only count bitmap equal 1)
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

    // Print "Offline" or "Online"
    console.info('User 123:', await checkUserStatus(123));

    console.info('User 456:', await checkUserStatus(456));

    console.info('User 789:', await checkUserStatus(456));

    console.info('User 91011:', await checkUserStatus(91011));

    console.info('User 111:', await checkUserStatus(111));

    console.info('Total users online:', await countUsersOnline());

    redis.quit();
};

handleRunCheck();
