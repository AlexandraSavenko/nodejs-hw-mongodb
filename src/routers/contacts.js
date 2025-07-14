import { Router } from 'express';

import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import validateBody from '../utils/validateBody.js';
import {contactAddSchema, contactUpdateSchema} from "../validation/contacts.js";
import { upload } from '../middlewares/upload.js';



const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

//upload.fields({name: "photo-one", maxCount: 1}, {name: "photo-two", maxCount: 10});
//apload.array('photo', 10)
contactsRouter.post('/', upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(contactsControllers.addContactController));

contactsRouter.put('/:contactId', isValidId, validateBody(contactAddSchema), ctrlWrapper(contactsControllers.upsertContactController));

contactsRouter.patch('/:contactId', upload.single("photo"), isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactsControllers.patchContactController));

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(contactsControllers.deleteContactController));



export default contactsRouter;
