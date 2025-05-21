import axiosInstance from './axiosInstance';
import { CheckInPayload, MapSearchParams, OpenToTalkPayload } from './types';

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


export const getOpenToTalkStatus = async (userId: string) => {
  const response = await axiosInstance.get(`/home/open-to-talk/${userId}`);
  return response.data;
};


export const getMapSearchResults = async (params: MapSearchParams) => {
  const { query, lat, lng, radius, limit } = params;

  console.log('MapSearchParams:', params);

  let url = '';
  let queryParams = {};

  if (query && query.trim() !== '') {
    // Use text-based search endpoint
    url = '/home/map/search';
    queryParams = { query };
  } else {
    // Use coordinate-based search endpoint
    if (lat == null || lng == null || radius == null || limit == null) {
      throw new Error('lat, lng, radius, and limit must be provided when query is empty.');
    }
    url = '/home/map';
    queryParams = { lat, lng, radius, limit };
  }

  console.log('URL:', url);
    console.log('Query Params:', queryParams);
  const response = await axiosInstance.get(url, { params: queryParams });
  return response.data;
};





