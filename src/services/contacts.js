import ContactsCollection from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({page = 1, perPage = 10, sortOrder = "asc", sortBy = "_id", isFavouriteFilter, typeFilter = "", userIdFilter}) => {
  const skip = (page - 1) * perPage;
  const query = ContactsCollection.find().skip(skip).limit(perPage).sort({[sortBy] : sortOrder});
  if(typeFilter){
    query.where("contactType").equals(typeFilter);
  }
  if(typeof isFavouriteFilter === "boolean"){
    query.where("isFavourite").equals(isFavouriteFilter);
  }
  if(userIdFilter){
    query.where("userId").equals(userIdFilter);
  }
  const data = await query;
  const totalItems = await ContactsCollection.countDocuments();
  const paginationData = calculatePaginationData({totalItems, page, perPage, });
return {data, ...paginationData};
};

export const getContactById = (id) => ContactsCollection.findById(id);

export const addContact = (payload) => ContactsCollection.create(payload);

export const updateContact = async ({ _id, payload, options = {} }) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id },
    payload,
    { ...options, includeResultMetadata: true },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactsCollection.findOneAndDelete(filter);
