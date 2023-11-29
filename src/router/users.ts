import express from 'express';
import { deleteUser, getAllUsers, updatePetTypeByIdHandler,updatePointByIdHandler  } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated,  getAllUsers);
    router.delete('/users/:id',isAuthenticated, isOwner,  deleteUser)
    router.put('/users/pet/:id',isAuthenticated, isOwner,  updatePetTypeByIdHandler)
    router.put('/users/point/:id',isAuthenticated, isOwner,  updatePointByIdHandler)
}

//test