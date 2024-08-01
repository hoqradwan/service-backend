import moment from 'moment';
import { getTime } from '../../helpers/momentHelpers.js';
import { Download } from './download.model.js';

export const addDownloadIntoDB = async (payload) => {
  payload['downloadedAt'] = moment();
  payload['downloadedBy'] = "robin@gmail.com";
  const result = await Download.create(payload);
  return result;
};

export const getMyDownloadsFromDB = async () => {
    const downloads = await Download.find({downloadedBy: "robin@gmail.com"});

  const result = downloads.map(download => {
    return {
      ...download.toObject(),
      time: getTime(new Date(download.downloadedAt))
    };
  });

  return result;
};
