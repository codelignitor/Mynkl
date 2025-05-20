import axiosInstance from './axiosInstance';
import { CheckInPayload, OpenToTalkPayload } from './types';

export const checkIn = async (userId: string, payload: CheckInPayload) => {
  const response = await axiosInstance.post(`/home/check-in`, payload, {
    params: {
      user_id: userId,
    },
  });

  return response.data;
};

export const getCheckIns = async (userId: string) => {
  const response = await axiosInstance.get(`/home/check-ins/${userId}`);
  return response.data;
};

export const updateOpenToTalk = async (userId: string, payload: OpenToTalkPayload) => {
  const response = await axiosInstance.put(`/home/open-to-talk/${userId}`, payload);
  return response.data;
};



