import { LicenseModel } from './license.model.js';

export const createLicenseIntoDB = async (payload) => {
  const result = await LicenseModel.create(payload);
  return result;
};
export const getLicensesFromDB = async () => {
  const result = await LicenseModel.find({});
  return result;
};
export const updateLicenseIntoDB = async (licenseid, data) => {
  const result = await LicenseModel.findByIdAndUpdate(licenseid, data);
  return result;
};
export const deleteLicenseFromDB = async (licenseid, data) => {
  const result = await LicenseModel.findByIdAndDelete(licenseid, data);
  return result;
};
