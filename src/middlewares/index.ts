import express from 'express';
import {get, merge} from 'lodash';

import { getUserBySessionToken } from '../db/user';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = get(req, "cookies.sessionToken");
        if(!sessionToken){
            return res.sendStatus(403);
        }


        const existingUser = await getUserBySessionToken(sessionToken);
        if(!existingUser){
            return res.sendStatus(403);
        }
        merge(req, {identity: existingUser});
        return next();
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }

}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const {id} = req.params;
        const currentUserId = get(req, "identity._id") as string;
      

        if(id !== currentUserId.toString()){
            return res.sendStatus(403);

        }
        if(currentUserId.toString() !== id){
            return res.sendStatus(403);
        }
        next();
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
}
