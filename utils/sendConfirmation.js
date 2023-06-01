import jwt from 'jsonwebtoken';

import sendMail from './sendEmail.js';

export function sendConfirmation(user){
    jwt.sign({id: user.id,},process.env.JWT_SECRET,{expiresIn: '1d',},async (err, emailToken) => {

        const url = `http://localhost:5000/users/confirmation/${emailToken}`;

        const message = `Please click this email to confirm your email: <a href="${url}">${url}</a>`;

        await sendMail({
            email: user.email,
            subject: 'Confirmation Email',
            message
        });
    });
}


export function sendResetPassword(user){
    jwt.sign({id: user.id,},process.env.JWT_SECRET,{expiresIn: '1d',},async (err, token) => {

        const url = `http://localhost:5000/users/reset-password/${token}`;

        const message = `Please click this email to confirm your email: <a href="${url}">${url}</a>`;

        await sendMail({
            email: user.email,
            subject: 'Reset Password Email',
            message
        });
    });
}
