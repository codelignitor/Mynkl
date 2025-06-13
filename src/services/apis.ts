import axiosInstance from './axiosInstance';
import { CheckInPayload, MapSearchParams, OpenToTalkPayload } from './types';

export const checkIn = async ( payload: CheckInPayload) => {
  const response = await axiosInstance.post(`/home/check-in`, payload, {
  
  });

  return response.data;
};

export const createEvent = async ( payload ) => {
  const response = await axiosInstance.post(`/events/create_event`, payload, {
   
  });

  return response.data;
};




export const getCheckIns = async (userId: string) => {
  const response = await axiosInstance.get(`/home/check-ins`);
  return response.data;
};

export const updateOpenToTalk = async (userId: string, payload: OpenToTalkPayload) => {
  const response = await axiosInstance.put(`/home/open-to-talk`, payload);
  return response.data;
};


export const getOpenToTalkStatus = async (userId: string) => {
  const response = await axiosInstance.get(`/home/open-to-talk`);
  return response.data;
};


export const getEventDetails = async (eventId: string) => {
  const response = await axiosInstance.get(`/events/${eventId}`);
  return response.data;
};

export const joinEvent = async (eventId: string) => {
  const response = await axiosInstance.post(`/events/join/${eventId}`);
  return response.data;
};

export const getHomeDetails = async () => {
  console.log('Fetching home details...');
  const response = await axiosInstance.get('/home');
  return response.data;
};

export const getEvents = async () => {
  const response = await axiosInstance.get(`/events/events`);
  return response.data;
};


export const getMapSearchResults = async (params: MapSearchParams) => {
  const { query, lat, lng, radius, limit ,mood } = params;

  

  console.log('MapSearchParams:', params);

  let url = ''
  let queryParams = {};

  if (query && query.trim() !== '') {
    // Use text-based search endpoint
    url = '/home/map';
    queryParams = { query , lat, lng };
  } else {
    // Use coordinate-based search endpoint
    if (lat == null || lng == null ) {
      throw new Error('lat, lng, radius, and limit must be provided when query is empty.');
    }
    url = '/home/map';
    queryParams = { lat, lng };
  }

  console.log('URL:', url);
    console.log('Query Params:', queryParams);
  const response = await axiosInstance.get(url, { params: queryParams });
  return response.data;
};




export const preferences = async (payload) => {
  const response = await axiosInstance.post(`/home/preferences` , payload);
  return response.data;
};



