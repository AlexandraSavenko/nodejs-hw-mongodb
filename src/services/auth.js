import createHttpError from "http-errors";
import userCollection from "../db/models/User.js";
import bcrypt from "bcrypt";

export const register = async payload => {
    const {email, password} = payload;
    const user = await userCollection.findOne({email});
    if(user){
        throw createHttpError(409, "Email already in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    return userCollection.create({...payload, password: hashPassword}); 
};