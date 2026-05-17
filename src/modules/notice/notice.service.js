import { Notice } from './notice.model.js';

export const getAllNoticeFromDB = async () => {
  const result = await Notice.find().sort({ createdAt: -1 });

  return result;
};

export const createNoticeIntoDB = async (payload) => {
  const { service } = payload;

  if (payload.active) {
    const activeNotice = await Notice.findOne({
      service,
      active: true,
    });

    if (activeNotice) {
      throw new Error(`An active notice already exists for ${service}`);
    }
  }

  const result = await Notice.create(payload);
  return result;
};

export const updateNoticeIntoDB = async (noticeId, payload) => {
  const existingNotice = await Notice.findById(noticeId);

  if (!existingNotice) {
    throw new Error('Notice not found!');
  }

  //  If service or active is being updated, enforce rule
  const serviceToCheck = payload.service || existingNotice.service;
  const willBeActive =
    payload.active !== undefined ? payload.active : existingNotice.active;

  // Check if another ACTIVE notice exists for same service
  const duplicateActiveNotice = await Notice.findOne({
    _id: { $ne: noticeId }, // exclude current notice
    service: serviceToCheck,
    active: true,
  });

  if (willBeActive && duplicateActiveNotice) {
    throw new Error(
      `Another active notice already exists for ${serviceToCheck}`,
    );
  }

  const result = await Notice.findByIdAndUpdate(noticeId, payload, {
    new: true,
  });

  return result;
};

export const deleteNoticeFromDB = async (noticeId) => {
  const isExists = await Notice.findById(noticeId);

  if (!isExists) {
    throw new Error('Notice not found!');
  }

  const result = await Notice.findByIdAndDelete(noticeId);

  return result;
};

export const getSingleNoticeFromDB = async (noticeId) => {
  const result = await Notice.findById(noticeId);

  if (!result) {
    throw new Error('Notice not found!');
  }

  return result;
};

export const getActiveNoticeByServiceFromDB = async (service) => {
  const notice = await Notice.findOne({
    service,
    active: true,
  });

  return notice;
};
