import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const sessionSchema = new Schema({
userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
},
accessToken: {
    type: String,
    required: true
},
refreshToken: {
    type: String,
    required: true
},
accessTokenValidUntill: {
    type: Date,
required: true,
},
refreshTokenValidUntill: {
    type: Date,
required: true,
}
}, {versionKey: false, timestamps: true});
sessionSchema.post("save", handleSaveError);
sessionSchema.pre("findOneAndUpdate", handleSaveError);
sessionSchema.post("findOneAndUpdate", handleSaveError);
const SessionCollection = model("session", sessionSchema);

export default SessionCollection;