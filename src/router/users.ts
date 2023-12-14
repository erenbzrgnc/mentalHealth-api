import express from 'express';
import { deleteUser, getAllUsers, updatePetTypeByIdHandler, updatePointByIdHandler, addFriend, removeFriend, getFriends } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {

    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
    router.put('/users/pet/:id', isAuthenticated, isOwner, updatePetTypeByIdHandler);
    router.put('/users/point/:id', isAuthenticated, isOwner, updatePointByIdHandler);

    router.post('/users/addfriend/:id', isAuthenticated, addFriend);

    router.delete('/users/:id/removefriend/:friendId', isAuthenticated, isOwner, removeFriend);

    router.get('/users/friends/:id', isAuthenticated, getFriends);
};


//test