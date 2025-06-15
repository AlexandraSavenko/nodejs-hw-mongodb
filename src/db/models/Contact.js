import { Schema, model } from 'mongoose';
import {typeList} from "../../constants/contacts.js";
import { handleSaveError, setUpdateSettings } from './hooks.js';
const contactSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 6},
  phoneNumber: { type: String, required: true },
  email: { type: String },
  isFavourite: { type: Boolean, default: false },
  contactType: {
    type: String,
    enum: typeList,
    required: true,
    default: 'personal',
  },
},
{
    timestamps: true,
    versionKey: false,
  });

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("findOneAndUpdate", handleSaveError);


const ContactsCollection = model('contacts', contactSchema);

export default ContactsCollection;

// {
//     "name": "Bob",
//     "phoneNumber": "5550123",
//     "email": "mrBob@gmail.com",
//     "isFavourite": true,
//     "contactType": "work"
// }