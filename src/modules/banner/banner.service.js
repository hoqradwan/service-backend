import { Banner } from './banner.model.js';

export const createBannerIntoDB = async (payload) => {
  const isExists = await Banner.findOne({
    fileName: payload?.fileName,
    goToURL: payload?.goToURL,
  });
  if (isExists) {
    throw new Error('Banner is already exists!');
  }
  const result = await Banner.create(payload);
  return result;
};


export const deleteBannerFromDB = async (bannerId) => {
  const isExists = await Banner.findById(bannerId);
  if (!isExists) {
    throw new Error('Banner not found!');
  }
  const result = await Banner.findByIdAndDelete(bannerId)
  return result;
};

export const getAllBannerFromDB = async () => {
  const result = await Banner.find();
  return result;
};