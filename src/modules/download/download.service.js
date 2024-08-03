import moment from 'moment';
import { getTime } from '../../helpers/momentHelpers.js';
import { Download } from './download.model.js';

export const addDownloadIntoDB = async (payload, requestedUser) => {
  payload['downloadedAt'] = moment();
  payload['downloadedBy'] = requestedUser.email;
  const result = await Download.create(payload);
  return result;
};

export const getMyDownloadsFromDB = async (requestedUser) => {
  const downloads = await Download.find({ downloadedBy: requestedUser.email });

  const result = downloads.map(download => {
    return {
      ...download.toObject(),
      time: getTime(new Date(download.downloadedAt))
    };
  });

  return result;
};

// Daily download count service by user email
export const getDailyDownloadCountService = async (userEmail) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const result = await Download.aggregate([
    {
      $match: {
        downloadedBy: userEmail,
        status: new RegExp('^accepted$', 'i'), // Case-insensitive match
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    },
    {
      $count: "dailyDownloadCount"
    }
  ]);

  return result.length > 0 ? result[0].dailyDownloadCount : 0;
};

// Total download count service by user email
export const getTotalDownloadCountService = async (userEmail) => {
  return await Download.countDocuments(
    {
      downloadedBy: userEmail,
      status: "accepted"
    }
  );
};

// Daily download count service for license
export const getDailyDownloadCountForLicenseService = async (licenseId) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const result = await Download.aggregate([
    {
      $match: {
        licenseId: licenseId,
        status: new RegExp('^accepted$', 'i'), // Case-insensitive match
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    },
    {
      $count: "dailyDownloadCountForLicense"
    }
  ]);

  return result.length > 0 ? result[0].dailyDownloadCountForLicense : 0;
};

// Total download count service by user email
export const getTotalDownloadCountForLicenseService = async (licenseId) => {
  return await Download.countDocuments(
    {
      licenseId: licenseId,
      status: "accepted"
    }
  );
};


