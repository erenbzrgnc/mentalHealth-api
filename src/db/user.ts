import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    surname: { type: String }
});

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true},
    authentication : {
        password: {type: String, required:true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},

    },
    birthdate: {type: Date, required:false},
    point: {type: Number, required:false},
    petType: {type: String, required:false},
    friendList: [FriendSchema],

});

// default point ve petType values when user is created

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email:string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken:string) => UserModel.findOne({"authentication.sessionToken": sessionToken});
export const getUserById = (id:string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user)=> user.toObject());
export const deleteUserById = (id:string) => UserModel.findByIdAndDelete({_id:id});
export const updateUserById = (id:string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)

// Retrieval Functions
export const getPointById = (id: string) => UserModel.findById(id).then(user => user?.point);

export const getPetTypeById = (id: string) => UserModel.findById(id).then(user => user?.petType);

export const getFriendListById = (id: string) => UserModel.findById(id).then(user => user?.friendList);

// Update Functions
export const updatePointById = (id: string, newPoint: number) => UserModel.findByIdAndUpdate(id, { point: newPoint }, { new: true });

export const updatePetTypeById = (id: string, newPetType: string) => UserModel.findByIdAndUpdate(id, { petType: newPetType }, { new: true });

export const updateFriendListById = (id: string, newFriendList: Array<any>) => UserModel.findByIdAndUpdate(id, { friendList: newFriendList }, { new: true });

