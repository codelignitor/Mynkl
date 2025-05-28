import { useState, useEffect } from 'react';
import { getEvents } from '../services/apis';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { router } from 'expo-router';

/**
 * Custom hook for managing activity data and related functionality
 * @param {string} activityId - Optional activity ID to fetch specific activity
 * @returns {Object} Activity data and related functions
 */
export const useActivity = (activityId = null) => {

  const [acitivitiesList , setActivitiesList] = useState([]);
  const [activityData, setActivityData] = useState({
    // User info
    username: "mynkl",
    
    // Status content (renamed from postText)
    statusText: "I'm feeling happy 😊",
    
    // Event info
    eventTitle: "Live Music Meetup",
    eventTime: "Today • 8:00 PM",
    
    // Guided Meditation section
    guidedTitle: "Guided",
    guidedText: "Meditation",
    
    // Mindfulness section
    mindfulnessTitle: "Mindfulness",
    mindfulnessText: "Guided Meditation",
    
    // Exercise section
    exerciseTitle: "Exercise",
    exerciseSubtitle: "Evening Yoga",
    
    // Create Art section
    createTitle: "Create",
    createSubtitle: "Colorful Art"
  });

  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // State for error handling
  const [error, setError] = useState(null);
  
  // Clean up effect for unmounting
  useEffect(() => {
    let isMounted = true;
    
    // Fetch data if an ID is provided
    if (activityId) {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call with setTimeout
      const timer = setTimeout(() => {
        if (isMounted) {
          // Update with simulated data
          setActivityData(prev => ({
            ...prev,
            statusText: `Activity ${activityId}: I'm feeling happy 😊`
          }));
          setIsLoading(false);
        }
      }, 500);
      
      // Clean up function
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
    
    return () => {
      isMounted = false;
    };
  }, [activityId]);
  
  /**
   * Function to format event times
   */
  const formatEventTime = (date) => {
    if (!date || !(date instanceof Date)) {
      return '';
    }
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    return `Today • ${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  };
  
  /**
   * Function to handle activity actions like joining, bookmarking, sharing
   */
  const handleActivityAction = (action) => {
    if (!action) return false;
    
    console.log(`Handling ${action} for activity ${activityId || 'current'}`);
    
    // Handle join action
    if (action === 'join') {
      setActivityData(prev => ({
        ...prev,
        isJoined: !prev.isJoined
      }));
    }
    
    return true;
  };
  
  /**
   * Function to update activity status
   */
  const updateActivityStatus = (newStatus) => {
    if (typeof newStatus !== 'string') return;
    
    setActivityData(prev => ({
      ...prev,
      statusText: newStatus
    }));
  };


  const getActivities = async () => {
    try {
      setIsLoading(true);
      const response = await getEvents();
       setActivitiesList(response);

      
     
      
    } catch (err) {
     
    } finally {
      setIsLoading(false);
    }
  }

  const goToDetailsHandler = (activityId) => {
     router.push(`/activities/${activityId}`);

  }

  useEffect(() => {
    getActivities();
  }, []);
  
  // Return all the data and functions needed by components
  return {
    // Data
    activityData,
    isLoading,
    error,
    acitivitiesList,
    // Functions
    formatEventTime,
    handleActivityAction,
    updateActivityStatus,
    goToDetailsHandler
  };
};