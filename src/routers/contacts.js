import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrWrapper.js';
const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get('/:id', ctrlWrapper(contactsControllers.getContactByIdController));

contactsRouter.post('/', ctrlWrapper(contactsControllers.addContactController));

contactsRouter.put('/:id', ctrlWrapper(contactsControllers.upsertController));



export default contactsRouter;
