import moment from 'moment';
import { getTime } from '../../helpers/momentHelpers.js';
import { Download } from './download.model.js';
import { default as customMoment } from 'moment-timezone';

export const addDownloadIntoDB = async (payload, requestedUser) => {
  payload['downloadedAt'] = moment();
  payload['downloadedBy'] = requestedUser.email;

  const result = await Download.create([payload]);
  return result;
};

export const getMyDownloadsFromDB = async (requestedUser, page, limit) => {

  const result = await Download.aggregate([
    {
      $match: {
        downloadedBy: requestedUser.email,
      },
    },
    {
      $setWindowFields: {
        sortBy: { createdAt: -1 }, // Sort by downloadedAt in descending order
        output: {
          serial: {
            $documentNumber: {}, // Generates a sequential number for each document
          },
        },
      },
    },
    {
      $project: {
        createdAt: 0,  // Exclude these fields from each download document
        updatedAt: 0,
        __v: 0,
        serviceId: 0,
        licenseId: 0,
      }
    }
  ]);

  return result.map((download) => ({
    ...download,
    time: getTime(new Date(download.downloadedAt)),
  }));
};


// Daily download count service by user email
export const getDailyDownloadForUserService = async (userEmail, service) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const downloads = await Download?.aggregate([
    {
      $match: {
        downloadedBy: userEmail,
        service: new RegExp(`^${service}$`, 'i'), // Case-insensitive match for service 
        status: new RegExp('^accepted$', 'i'), // Case-insensitive match status
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $setWindowFields: {
        sortBy: { createdAt: -1 }, // Sort by time of creation
        output: {
          serial: {
            $documentNumber: {}, 
          },
        },
      },
    },
    {
      $project: {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        serviceId: 0,
        licenseId: 0,
      }
    }
  ]);

  const dailyDownloadCount = downloads?.length;
  return {
    dailyDownloadCount,
    dailyDownloads: downloads,
  };
};






export const getTotalDownloadForUserService = async (userEmail, service) => {
  const result = await Download.aggregate([
    {
      $match: {
        downloadedBy: userEmail,
        service: service,
        status: 'accepted',
      },
    },
    {
      $setWindowFields: {
        sortBy: { downloadedAt: -1 }, // Sort by time of creation
        output: {
          serial: {
            $documentNumber: {}, // Generates a sequential number for each document
          },
        },
      },
    },
    {
      $project: {
        createdAt: 0, // Excluding unnecessary fields
        updatedAt: 0,
        __v: 0,
        serviceId: 0,
        licenseId: 0,
      }
    }
  ]);

  const totalDownloadCount = result?.length;
  const downloads = result?.map((download) => ({
    ...download,
    time: getTime(new Date(download.downloadedAt)),
  }));
  // Return both the count and the documents with serial numbers
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
      $setWindowFields: {
        partitionBy: "$licenseId",
        sortBy: { createdAt: -1 }, // Sort by time of creation
        output: {
          serial: {
            $documentNumber: {}, // Generates a sequential number for each document
          },
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
    {
      $project: {
        "downloads.createdAt": 0,  // Exclude these fields from each download document
        "downloads.updatedAt": 0,
        "downloads.__v": 0,
        "downloads.status": 0,
        "downloads.serviceId": 0,
        "downloads.licenseId": 0,
      }
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
  const result = await Download.aggregate([
    {
      $match: {
        licenseId: licenseId,
        status: 'accepted',
      },
    },
    {
      $setWindowFields: {
        partitionBy: "$licenseId",
        sortBy: { createdAt: 1 }, // Sort by time of creation
        output: {
          serial: {
            $documentNumber: {}, // Generates a sequential number for each document
          },
        },
      },
    },
    {
      $project: {
        "createdAt": 0,  // Exclude these fields from each download document
        "updatedAt": 0,
        "__v": 0,
        "status": 0,
        "serviceId": 0,
        "licenseId": 0,
      }
    }
  ]);

  const count = result?.length;

  return {
    count,
    licenseDownloads: result,
  };
};


// Daily download for cookie account by service Id
export const getDailyDownloadForCookieService = async (serviceId) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const result = await Download.aggregate([
    {
      $match: {
        serviceId: serviceId,
        status: new RegExp('^accepted$', 'i'), // Case-insensitive match
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $setWindowFields: {
        partitionBy: "$serviceId",
        sortBy: { createdAt: 1 }, // Sort by time of creation
        output: {
          serial: {
            $documentNumber: {}, // Generates a sequential number for each document
          },
        },
      },
    },
    {
      $project: {
        "createdAt": 0,  // Exclude these fields from each download document
        "updatedAt": 0,
        "__v": 0,
        "status": 0,
        "serviceId": 0,
        "licenseId": 0,
      }
    }
  ]);

  const dailyDownloadCount = result?.length;

  return {
    dailyDownloadCount,
    dailyDownloads: result,
  };
};


// Total download for cookie account by service Id
export const getTotalDownloadForCookieService = async (serviceId) => {
  const result = await Download.aggregate([
    {
      $match: {
        serviceId: serviceId,
        status: 'accepted',
      },
    },
    {
      $setWindowFields: {
        partitionBy: "$serviceId",
        sortBy: { createdAt: 1 }, // Sort by time of creation
        output: {
          serial: {
            $documentNumber: {}, // Generates a sequential number for each document
          },
        },
      },
    },
    {
      $project: {
        "createdAt": 0,  // Exclude these fields from each download document
        "updatedAt": 0,
        "__v": 0,
        "status": 0,
        "serviceId": 0,
        "licenseId": 0,
      }
    }
  ]);

  const count = result?.length;

  return {
    count,
    serviceDownloads: result,
  };
};


// Total download for cookie account by service Id
export const getDownloadById = async (downloadId) => {
  return await Download?.findById(downloadId);
};

// get the total number of download count service
export const downloadCountService = async (email) => {
  return Download.countDocuments({
    downloadedBy: email,
  });
};


// update cookie service
export const updateDownloadByIdService = async (id, updateData) => {
  // update the cookie
  return await Download?.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true // Ensure that the update data conforms to the schema
  });
};

// service for getting the total number of daily download 
export const getTotalAndDailyDownloadsService = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const result = await Download.aggregate([
    {
      $facet: {
        dailyDownloads: [
          {
            $match: {
              status: 'accepted',
              createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
              },
            },
          },
          {
            $count: 'count',
          },
        ],
        totalDownloads: [
          {
            $match: {
              status: 'accepted',
            },
          },
          {
            $count: 'count',
          },
        ],
      },
    },
    {
      $project: {
        dailyDownloads: { $arrayElemAt: ['$dailyDownloads.count', 0] },
        totalDownloads: { $arrayElemAt: ['$totalDownloads.count', 0] },
      },
    },
  ]);

  const counts = result[0] || {};
  return {
    dailyDownloads: counts.dailyDownloads || 0,
    totalDownloads: counts.totalDownloads || 0,
  };
};
