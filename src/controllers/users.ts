import express from 'express';
import {addFriendById, deleteUserById, getFriendListById, getUserById, getUsers, removeFriendById, updatePetTypeById, updatePointById, updateUserById}   from '../db/user';

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



export const addFriend = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { friendId } = req.body; // Assuming you receive friendId in the request body
        const userId = id;

        if (!friendId) {
            return res.status(400).json({ error: 'Friend ID is required' });
        }

        // Prevent users from adding themselves as a friend
        if (userId === friendId) {
            return res.status(400).json({ error: 'Users cannot add themselves as a friend' });
        }

        // Check if the friend is already in the user's friend list
        const user = await getFriendListById(userId);
        if (user && user.some(friend => friend.friendId.toString() === friendId)) {
            return res.status(409).json({ error: 'Friend is already in the list' });
        }

        // Fetch friend's details from the database
        const friendData = await getUserById(friendId);
        if (!friendData) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        // Extract only the relevant attributes for FriendSchema
        const friendDetails = {
            friendId: friendData._id,
            email: friendData.email,
            name: friendData.firstName,
            surname: friendData.lastName,
            petType: friendData.petType,
            point: friendData.point
        };

        // Add the friend to the user's friend list
        const updatedUser = await addFriendById(userId, friendDetails);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Error in addFriend:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Controller to remove a friend from a specific user
export const removeFriend = async (req: express.Request, res: express.Response) => {
    try {
        const { id, friendId } = req.params;
        const userId = id;

        // Fetch user's details including the friend list
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the friend list is empty or the friend is not in the list
        if (!user.friendList || !user.friendList.some(friend => friend.friendId.toString() === friendId)) {
            return res.status(404).json({ error: 'Friend not found in user\'s friend list' });
        }

        // Remove the friend from the user's friend list
        const updatedUser = await removeFriendById(userId, friendId);
        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Error in removeFriend:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Controller to display all friends for a specific user
export const getFriends = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const userId = id;

        const userWithFriends = await getFriendListById(userId);
        if (!userWithFriends) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(userWithFriends || []);
    } catch (err) {
        console.error('Error in getFriends:', err);
        return res.status(500).json({ error: err.message });
    }
};