import { createUser, getUserByEmail } from '../db/user';
import {authentication, random} from '../helpers';
import express from 'express';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        // If email or password is missing, send a 400 status and stop further execution
        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select("+authentication.password +authentication.salt");

        // If no user is found, send a 400 status and stop further execution
        if (!user) {
            return res.sendStatus(400);
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
        const {firstName, lastName, email, password} = req.body;
        if (!firstName || !lastName || !email || !password) {
            res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.sendStatus(409);
        }
        const salt = random();
        const user = await createUser({
            firstName,
            lastName,
            email,
            authentication: {
                password: authentication(salt, password),
                salt,

            },
            birthdate: null,
            point: 0,
            petType: null,
            friendList: [],

        });
        return res.status(200).json(user).end();
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
    }

