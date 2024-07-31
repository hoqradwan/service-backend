import {
    createSupportIntoDB,
    deleteSupportFromDB,
    getAllSupportFromDB,
} from './support.service.js';

export const createSupport = async (req, res) => {
  try {
    const result = await createSupportIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: 'Support is added successfully.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create support!',
    });
  }
};

export const deleteSupport = async (req, res) => {
  try {
    const supportId = req.params?.id;
    if (!supportId) {
      throw new Error('id is required!');
    }
    const result = await deleteSupportFromDB(supportId);
    res.status(200).json({
      success: true,
      message: 'Support is deleted successfully.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete support!',
    });
  }
};

export const getAllSupport = async (req, res) => {
  try {
    const result = await getAllSupportFromDB();
    res.status(200).json({
      success: true,
      message: 'All supoprts are retrieved successfully.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get supports!',
    });
  }
};
