import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import validateBody from '../utils/validateBody.js';
import {contactAddSchema, contactUpdateSchema} from "../validation/contacts.js";
const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

contactsRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(contactsControllers.addContactController));

contactsRouter.put('/:id', isValidId, validateBody(contactAddSchema), ctrlWrapper(contactsControllers.upsertContactController));

contactsRouter.patch('/:id', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactsControllers.patchContactController));

contactsRouter.delete('/:id', isValidId, ctrlWrapper(contactsControllers.deleteContactController));



export default contactsRouter;
