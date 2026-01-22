import crypto from 'crypto';

const validateInviteToken = (req, res, next) => {
    try {
        const token = req.params.token;
        if (!token) return res.status(400).json({error: 'No token'});
        
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
        
        const expectedHash = crypto.createHmac('sha256', process.env.TOKEN_KEY)
            .update(decoded.groupId + decoded.expires)
            .digest('hex');
            
        if (decoded.signature !== expectedHash) {
            return res.status(401).json({error: 'Invalid token'});
        }
        
        if (Date.now() > decoded.expires) {
            return res.status(401).json({error: 'Expired'});
        }
        
        req.invitation = {groupId: decoded.groupId};
        next();
        
    } catch (err) {
        res.status(401).json({error: 'Invalid token'});
    }
};

export default ValidateInviteToken;