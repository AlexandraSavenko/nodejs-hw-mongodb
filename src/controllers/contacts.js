// import ContactsCollection from '../db/models/Contact.js';
import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  const data = await contactServices.getContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const data = await contactServices.getContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id ${id} is not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
const data = await contactServices.addContact(req.body);
console.log(data);

res.status(201).json({
  status: 201,
  message: "Contact successfully added",
  data
});
};

export const upsertController = async (req, res) => {
  const {id: _id} = req.params;
  //const _id = req.params.id;

  console.log("controller", _id);
const result = await contactServices.updateContact({_id, payload: req.body, options: {upsert: true}});

const status = result.isNew ? 201 : 200;
res.status(status).json({
  status,
  message: "Contact has been successfully upserted",
  data: result.data
});
};