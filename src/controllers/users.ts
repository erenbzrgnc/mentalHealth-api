import express from 'express';
import {deleteUserById, getUsers, updatePetTypeById, updatePointById, updateUserById}   from '../db/user';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users = await getUsers();
        return res.status(200).json(users).end();
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
}

export const updatePetTypeByIdHandler = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { petType } = req.body;

        const updatedUser = await updatePetTypeById(id, petType);
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        return res.json(updatedUser);
    } catch (err) {
        console.error('Error in updatePetTypeByIdHandler:', err);
        return res.status(400).json({ error: err.message });
    }
};


export const updatePointByIdHandler = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const {point} = req.body;
        const updatedUser = await updatePointById(id, point);
        return res.json(updatedUser);
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
}
