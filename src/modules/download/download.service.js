import moment from 'moment';
import { getTime } from '../../helpers/momentHelpers.js';
import { Download } from './download.model.js';
import mongoose from 'mongoose';

export const addDownloadIntoDB = async (payload, requestedUser) => {
  payload['downloadedAt'] = moment();
  payload['downloadedBy'] = requestedUser.email;
  // console.log(payload, 'from dwonload service');
  const result = await Download.create([payload]);
  console.log(result);
  return result;
};

export const getMyDownloadsFromDB = async (requestedUser) => {
  const downloads = await Download.find({ downloadedBy: requestedUser.email }).sort("-downloadedAt");

  const result = downloads.map((download) => {
    return {
      ...download.toObject(),
      time: getTime(new Date(download.downloadedAt)),
    };
  });

  return result;
};

// Daily download count service by user email
export const getDailyDownloadForUserService = async (userEmail) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const downloads = await Download.find({
    downloadedBy: userEmail,
    status: new RegExp('^accepted$', 'i'), // Case-insensitive match
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  const dailyDownloadCount = downloads?.length;

  return {
    dailyDownloadCount,
    dailyDownloads: downloads,
  };
};

// Total download count service by user email
export const getTotalDownloadForUserService = async (userEmail) => {
  const downloads = await Download.find({
    downloadedBy: userEmail,
    status: 'accepted',
  });

  const totalDownloadCount = downloads?.length;
  // Return both the count and the documents
  return {
    totalDownloadCount,
    downloads,
  };
};

// Daily download count service for license
export const getDailyDownloadForLicenseService = async (licenseId) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const result = await Download.aggregate([
    {
      $match: {
        licenseId: licenseId,
        status: new RegExp('^accepted$', 'i'),
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $group: {
        _id: '$licenseId',
        downloads: { $push: '$$ROOT' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    return {
      count: result[0].count,
      licenseDailyDownload: result[0].downloads,
    };
  } else {
    return {
      count: 0,
      licenseDailyDownload: [],
    };
  }
};

// Total download for license service
export const getTotalDownloadForLicenseService = async (licenseId) => {
  const downloads = await Download.find({
    licenseId: licenseId,
    status: 'accepted',
  });

  const count = downloads?.length;

  return {
    count,
    licenseDownloads: downloads,
  };
};

// Daily download for cookie account by service Id
export const getDailyDownloadForCookieService = async (serviceId) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const downloads = await Download.find({
    serviceId: serviceId,
    status: new RegExp('^accepted$', 'i'), // Case-insensitive match
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  const dailyDownloadCount = downloads?.length;

  return {
    dailyDownloadCount,
    dailyDownloads: downloads,
  };
};

// Total download for cookie account by service Id
export const getTotalDownloadForCookieService = async (serviceId) => {
  const downloads = await Download.find({
    serviceId: serviceId,
    status: 'accepted',
  });

  const count = downloads?.length;

  return {
    count,
    serviceDownloads: downloads,
  };
};
