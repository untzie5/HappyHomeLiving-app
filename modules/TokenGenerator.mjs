import crypto from 'crypto';

const generateToken = (groupId) => {
    const expires = Date.now() + 86400000;
    const signature = crypto.createHmac('sha256', process.env.TOKEN_KEY)
        .update(groupId + expires)
        .digest('hex');
        
    const tokenData = {groupId, expires, signature};
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
};

export default generateToken;