//mongodb+srv://Alex:<db_password>@cluster0.uejyekf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

//Alex
//je3ngPINdQnu51eS

import {env} from "../utils/env.js";
import mongoose from "mongoose";

export const initMongoConnection = async () => {
    try{
        const user = env("MONGODB_USER");
        const password = env("MONGODB_PASSWORD");
        const url = env("MONGODB_URL");
        const db = env("MONGODB_DB");
        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`);
        console.log("Mongo connection successfully established!");
    }
    catch(error){
throw new Error(error.message);
    }
};