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
    const downloads = await Download.find({downloadedBy: requestedUser.email});

  const result = downloads.map(download => {
    return {
      ...download.toObject(),
      time: getTime(new Date(download.downloadedAt))
    };
  });

  return result;
};
