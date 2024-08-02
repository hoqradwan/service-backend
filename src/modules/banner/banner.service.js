import { Banner } from './banner.model.js';

export const getAllBannerFromDB = async () => {
  const result = await Banner.find();
  return result;
};

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

export const updateBannerIntoDB = async (bannerId, payload) => {
  const isExists = await Banner.findById(bannerId);
  if (!isExists) {
    throw new Error('Banner not found!');
  }

  const result = await Banner.findByIdAndUpdate(bannerId, payload, {new: true});
  return result;
};

export const deleteBannerFromDB = async (bannerId) => {
  const isExists = await Banner.findById(bannerId);
  if (!isExists) {
    throw new Error('Banner not found!');
  }
  const result = await Banner.findByIdAndDelete(bannerId);
  return result;
};