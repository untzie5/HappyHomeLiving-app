import express from 'express';
import loadEnv from './loadEnv.mjs';
import ValidateInviteToken from './ValidateInviteToken.mjs';

loadEnv();

const app = express();

app.get('/join/:token', ValidateInviteToken, (req, res) => {
    res.json({message: 'Welcome!', groupId: req.invitation.groupId});
});