import moment from 'moment';
import { getTime } from '../../helpers/momentHelpers.js';
import { Download } from './download.model.js';

export const addDownloadIntoDB = async (payload) => {
  payload['downloadedAt'] = moment();
  const result = await Download.create(payload);
  return result;
};

export const getMyDownloadsFromDB = async () => {
    const downloads = await Download.find();

  const result = downloads.map(download => {
    return {
      ...download.toObject(),
      time: getTime(download.downloadedAt)
    };
  });

  return result;
};
