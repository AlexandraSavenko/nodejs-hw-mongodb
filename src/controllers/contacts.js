import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  const data = await contactServices.getContacts();
  if (!data) {
    throw createHttpError(404, `Contact not found`);
  }
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
    throw createHttpError(404, `Contact not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
const data = await contactServices.addContact(req.body);

res.status(201).json({
  status: 201,
  message: "Successfully created a contact!",
  data
});
};

export const upsertContactController = async (req, res) => {
  const {id: _id} = req.params;
  //const _id = req.params.id;

const result = await contactServices.updateContact({_id, payload: req.body, options: {upsert: true}});

const status = result.isNew ? 201 : 200;
res.status(status).json({
  status,
  message: result.isNew ? "Successfully created a contact!" : "Successfully patched a contact!",
  data: result.data
});
};

export const patchContactController = async (req, res) => {
const {id: _id} = req.params;
const result = await contactServices.updateContact({_id, payload: req.body});
if(!result){
  throw createHttpError(404, `Contact not found`);
};
res.json({
  status: 200,
  message: `Successfully patched a contact!`,
  data: result.data
});
};

export const deleteContactController = async (req, res) => {
  const {id: _id} = req.params;
  const data = await contactServices.deleteContact({_id});
  if(!data){
  throw createHttpError(404, `Contact not found`);
};
res.status(204).send();
};