import { sendConfirmationEmail } from '../services/email';
import { UserModel, createUser, getUserByConfirmationToken, getUserByEmail, updateUserById } from '../db/user';
import {authentication, generateConfirmationToken, random} from '../helpers';
import express from 'express';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        // If email or password is missing, send a 400 status and stop further execution
        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select("+authentication.password +authentication.salt");

        // If no user is found, send a 404 status
        if (!user) {
            return res.status(404).send('User not found');
        }

        // If the user's email is not confirmed, send a 403 status
        if (!user.emailConfirmed) {
            return res.status(403).send('Email not confirmed');
        }

        // If password does not match, send a 403 status and stop further execution
        if (user.authentication.password !== authentication(user.authentication.salt, password)) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        // Set cookie and send response
        res.cookie("sessionToken", user.authentication.sessionToken, { domain: "localhost", path: "/" });
        return res.status(200).json(user).end();
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
};


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.sendStatus(409);
        }
        const salt = random();
        const hashedPassword = authentication(salt, password);
        const confirmationToken = generateConfirmationToken();

        const user = await createUser({
            firstName,
            lastName,
            email,
            authentication: {
                password: hashedPassword,
                salt,
            },
            birthdate: null,
            point: 0,
            petType: null,
            friendList: [],
            emailConfirmed: false,
            confirmationToken,
        });

        sendConfirmationEmail(email, confirmationToken);

        return res.status(200).json({ message: "Registration successful, please confirm your email." }).end();
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export const confirmEmail = async (req: express.Request, res: express.Response) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.sendStatus(400);
        }

        // Assuming getUserByConfirmationToken is a function you implement in your database layer
        // to retrieve a user by their confirmation token
        const user = await getUserByConfirmationToken(token as string);

        if (!user) {
            return res.status(404).send('Invalid token');
        }

        // If email is already confirmed, there's nothing more to do
        if (user.emailConfirmed) {
            return res.status(200).send('Email is already confirmed');
        }

        // Update the user's emailConfirmed field to true
        await updateUserById(user._id.toString(), { emailConfirmed: true });

        // Send a success response
        res.status(200).send('Email confirmed successfully');
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};


export const handleEmailConfirmationStatus = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.emailConfirmed) {
            return res.status(200).send('Email is confirmed');
        } else {
            return res.status(200).send('Email is not confirmed');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
};
