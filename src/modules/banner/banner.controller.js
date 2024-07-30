import { createBannerIntoDB, deleteBannerFromDB, getAllBannerFromDB } from './banner.service.js';

export const createBanner = async (req, res) => {
  try {
    const result = await createBannerIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: 'Banner is created successfully.',
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || 'Failed to create banner!',
      });
  }
};
export const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.params?.id;
    if(!bannerId) {
        throw new Error("id is required!");
    }
    const result = await deleteBannerFromDB(bannerId);
    res.status(200).json({
      success: true,
      message: 'Banner is deleted successfully.',
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || 'Failed to delete banner!',
      });
  }
};
export const getAllBanner = async (req, res) => {
  try {
    const result = await getAllBannerFromDB();
    res.status(200).json({
      success: true,
      message: 'All Banners are retrieved successfully.',
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || 'Failed to get banners!',
      });
  }
};
