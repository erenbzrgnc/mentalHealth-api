import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    name: { type: String },
    surname: { type: String },
    petType: { type: String },
    point: { type: Number },

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
    petType: {type: String, required:false, default: 'Pikachu'},
    friendList: [FriendSchema],
    emailConfirmed: {type: Boolean, required:false},
    confirmationToken: {type: String, required: false}, 

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

export const getUserByConfirmationToken = (token: string) => {
    return UserModel.findOne({ confirmationToken: token });
};

// Update Functions
export const updatePointById = (id: string, newPoint: number) => UserModel.findByIdAndUpdate(id, { point: newPoint }, { new: true });

export const updatePetTypeById = (id: string, newPetType: string) => UserModel.findByIdAndUpdate(id, { petType: newPetType }, { new: true });

export const updateFriendListById = (id: string, newFriendList: Array<any>) => UserModel.findByIdAndUpdate(id, { friendList: newFriendList }, { new: true });

// Add Functions
export const addFriendById = (userId: string, friendData: Record<string, any>) => {
    return UserModel.findByIdAndUpdate(userId, { $push: { friendList: friendData } }, { new: true });
};

// Delete Functions
export const removeFriendById = (userId: string, friendId: string) => {
    return UserModel.findByIdAndUpdate(userId, { $pull: { friendList: { friendId } } }, { new: true });
};



