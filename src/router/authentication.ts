import express from 'express';
import { confirmEmail, handleEmailConfirmationStatus, login, register } from '../controllers/authentication';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.get('/auth/user/:id/is-confirmed', handleEmailConfirmationStatus);
    router.get('/auth/confirm-email', confirmEmail);
    
}