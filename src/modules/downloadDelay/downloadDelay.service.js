import { DownloadRestrict } from './downloadDelay.model.js';

export const getDownloadRestrictionsFromDB = async () => {
  const result = await DownloadRestrict.find({});
  return result;
};
export const restrictDownloadIntoDB = async (restrictData) => {
  const result = await DownloadRestrict.create(restrictData);
  return result;
};
export const updateDownloadRestrictionIntoDB = async (updateRestrictData) => {
  const existingDoc = await DownloadRestrict.findOne({
    service: updateRestrictData.service,
  });

  if (!existingDoc) {
    throw new Error('Document not found for the given service.');
  }

  const result = await DownloadRestrict.findOneAndUpdate(
    { service: updateRestrictData.service },
    {
      ...updateRestrictData,
      isRestricted: !existingDoc.isRestricted, // Toggles based on previous value
    },
    { new: true }, // Returns the updated document
  );

  return result;
};
