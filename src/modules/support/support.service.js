import { Support } from "./support.model.js";


export const createSupportIntoDB = async (payload) => {
  const isExists = await Support.findOne({
    name: payload?.name,
    goToURL: payload?.goToURL,
  });
  if (isExists) {
    throw new Error('Support is already exists!');
  }
  const result = await Support.create(payload);
  return result;
};


export const deleteSupportFromDB = async (supportId) => {
  const isExists = await Support.findById(supportId);
  if (!isExists) {
    throw new Error('Support not found!');
  }
  const result = await Support.findByIdAndDelete(supportId)
  return result;
};

export const getAllSupportFromDB = async () => {
  const result = await Support.find();
  return result;
};