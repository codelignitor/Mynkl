import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { getComments, submitComments } from '@/src/services/apis';

type SimpleLocationDetail = {
  name: string;
  latitude: number;
  longitude: number;
  mood?: string;
} | null;

type Region = { latitude: number; longitude: number };

const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const makeCommentId = (content: string, locationKey: string) => {
  return `comment_${hashString(`${locationKey}:${content}`)}`;
};

export function useComments(args: {
  selectedLocationDetail: SimpleLocationDetail;
  mapRegion: Region;
  user_id: string;
  selectedMood: string;
  location:Object
}) {
  const { selectedLocationDetail, mapRegion, user_id, selectedMood } = args;

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [fetchedComments, setFetchedComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [comentsResponse , setCommentResponse] = useState<any>(null)

  const handleAddComment = useCallback(async () => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment || !selectedLocationDetail) {
      if (!selectedLocationDetail) {
        Alert.alert('Error', 'No location selected');
      }
      return;
    }

    // if (!currentUserId) {
    //   Alert.alert('Authentication Required', 'Please log in to post comments.');
    //   return;
    // }

    setIsSubmittingComment(true);
    try {
      const payload = {
         ref_id: selectedLocationDetail?.id,
        comment: trimmedComment,
       
      };

      await submitComments(payload);

      setNewComment('');
      refreshComments();
      Alert.alert('Success', 'Comment posted successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  }, [newComment, selectedLocationDetail, selectedMood, mapRegion, user_id]);

  const refreshComments = useCallback(async () => {
    // console.log('refreshComments called', selectedLocationDetail );
    
    if (!selectedLocationDetail?.name) return;
    setIsLoadingComments(true);
    try {

      const params ={
     type: selectedLocationDetail?.type ,
      ref_id: selectedLocationDetail?.id
      }
    
      const response = await getComments(
        params
      );
      let commentsData = response as any;
      if (response && (response as any).data && Array.isArray((response as any).data)) {
        commentsData = (response as any).data;
      }

      setCommentResponse(commentsData)

      const locationKey = `${selectedLocationDetail.latitude || mapRegion.latitude},${selectedLocationDetail.longitude || mapRegion.longitude}`;
      if (!Array.isArray(commentsData)) {
        const comments = commentsData?.comments || [];
        const checkInDetails = commentsData?.check_in_details || [];
        const allData = [
          ...comments.map((comment: string) => ({
            type: 'comment',
            content: comment,
            id: makeCommentId(comment, locationKey),
            userId: user_id || 'anonymous',
          })),
          ...checkInDetails.map((checkIn: { text?: string; mood: string; timestamp: string; user_id: string }) => ({
            type: 'checkin',
            content: checkIn.text || 'No message',
            mood: checkIn.mood,
            timestamp: checkIn.timestamp,
            userId: checkIn.user_id,
          })),
        ];
        setFetchedComments(allData);
      } else {
        const normalized = (commentsData || []).map((comment: any) => ({
          type: 'comment',
          content: typeof comment === 'string' ? comment : comment?.comments || '',
          id: makeCommentId(typeof comment === 'string' ? comment : comment?.comments || '', locationKey),
          userId: user_id || 'anonymous',
        }));
        setFetchedComments(normalized);
      }
    } catch (e) {
      setFetchedComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  }, [selectedLocationDetail?.latitude, selectedLocationDetail?.longitude, mapRegion.latitude, mapRegion.longitude, user_id]);

  // Clear or fetch when location changes
  useEffect(() => {
    if (selectedLocationDetail?.name) {
      setFetchedComments([]);
      setNewComment('');
      setIsLoadingComments(true);
    } else {
      setFetchedComments([]);
      setNewComment('');
      setIsLoadingComments(false);
    }
  }, [selectedLocationDetail?.name]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (selectedLocationDetail?.name) {
        refreshComments();
      }
    }, 500);
    return () => clearTimeout(t);
  }, [selectedLocationDetail?.latitude, selectedLocationDetail?.longitude, mapRegion.latitude, mapRegion.longitude, user_id, refreshComments]);

  const currentCheckIns = useMemo(() => {
    return fetchedComments.filter(item => item.type === 'checkin');
  }, [fetchedComments]);

  return {
    newComment,
    setNewComment,
    isSubmittingComment,
    fetchedComments,
    setFetchedComments,
    isLoadingComments,
    handleAddComment,
    refreshComments,
    currentCheckIns,
    comentsResponse
  } as const;
}


