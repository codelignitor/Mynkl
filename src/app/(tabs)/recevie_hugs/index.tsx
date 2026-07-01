import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Button,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPendingHugsDashboard, getVirtualHugOnboardingStatus, receiveHugsList, updateHugStatus } from '@/src/services/apis';
import { router } from 'expo-router';
import hugsLogo from '../../../assets/images/hugs_logo-removebg.png';
import { LinearGradient } from 'expo-linear-gradient'; 
import { saveConnectedHug } from '@/src/utils/connectionStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PendingHugsDetailScreen = ({ onBack }) => {

  const [hugsData, setHugsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);      
  const [totalPages, setTotalPages] = useState(1);         
  const [loadingMore, setLoadingMore] = useState(false);   

 const receiveHugsListHandler = async (page: number = 1, isLoadMore: boolean = false) => {
  try {
    isLoadMore ? setLoadingMore(true) : setLoading(true);

    const response = await receiveHugsList(page, 10);

    if (page === 1) {
      setHugsData(response?.list);
    } else {
      // Append new entries to existing list
      setHugsData((prev) => [...(prev ?? []), ...response?.list]);
    }
    

    setCurrentPage(response?.page);
    setTotalPages(response?.total_pages);

  } catch (error) {
    console.error("Failed to fetch hugs:", error);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};

useEffect(() => {
  receiveHugsListHandler();
}, []);


  const loadMore = () => {
  if (currentPage < totalPages && !loadingMore) {
    receiveHugsListHandler(currentPage + 1, true);
  }
};

  const getRelativeTime = (dateString) => {
  if (!dateString) return '';

  // Append 'Z' if missing to treat as UTC
  const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  
  const now = new Date();

  // Convert API time to UTC+5
  // const utcPlus5Offset = 5 * 60 * 60 * 1000;
  const utcPlus2Offset = 5 * 60 * 60 * 1000;
  const past = new Date(new Date(utcString).getTime() + utcPlus2Offset);
  const nowPlus = new Date(now.getTime() + utcPlus2Offset);

  const diffInMs = nowPlus - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hr' : 'hrs'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
};

  // Helper function to get gradient colors based on hug type
  const getHugGradient = (hugType) => {
    const type = hugType?.toLowerCase();
    if (type?.includes('warm')) {
      return ['#FFD6E8', '#E8D4F5'];
    } else if (type?.includes('calm')) {
      return ['#E8D4F5', '#E8D4F5'];
    } else if (type?.includes('excited')) {
      return ['#FFE8F5', '#E8D6FF'];
    } else {
      return ['#F5E8FF', '#E8F5FF'];
    }
  };

  // Helper function to get avatar background color-
  const getAvatarBg = (hugType) => {
    const type = hugType?.toLowerCase();
    if (type?.includes('warm')) {
      return '#ffe6d0';
    } else if (type?.includes('calm')) {
      return '#C8C8FF';
    } else if (type?.includes('excited')) {
      return '#FFD0F0';
    } else {
      return '#E0D0FF';
    }
  };

  // const handleHugReceive = () => {
  //   console.log('Start a Chat pressed');
  //   // Add navigation logic here
  //   router.push('/virtual-hug/receive-hug');
  //   // router.push('/hug_recevied');
    
  // };

  

 const handleHugReceive = async (item) => {
  try {
    const receiverType = item?.receiver_type?.toLowerCase();
    const responseType = item?.responsetype?.toLowerCase();

    const params = {
      message: item?.message,
      hugType: item?.hug_type,
      hugId: item?.id,
      hugSenderName: item?.user?.name,
      hugprofilePic: item?.user?.profile_pic,
      senderid: item?.user?.id,
      sendedat: item?.created_at,
      responseType: item?.responsetype,
      isHugBack: item?.is_hug_back,
      type: item?.type,
      emoji: item?.emoji,
    };

     // Store senderId + hugId
    await AsyncStorage.multiSet([
      ['sender_id', String(params.senderid)],
      ['hug_id', String(params.hugId)],
    ]);
    console.log('sender_id:', params.senderid);
    console.log('hug_id:', params.hugId);


    // GRATITUDE
    if (responseType === "gratitude") {
      router.push({
        pathname: "/sender_gratitude",
        params,
      });
      return;
    }

    // HUG BACK
    if (item?.is_hug_back === true) {
      router.push({
        pathname: "/sender_hugback",
        params,
      });
      return;
    }

    // REVEAL HUG CHECK
    const isRevealHug =
      item?.emoji &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        item.emoji
      );

    if (isRevealHug) {
      await updateHugStatus(item?.id, "seen");

      setHugsData((prev) =>
        prev.filter((hug) => hug.id !== item.id)
      );

      router.push({
        pathname: "/hug_reveal_screen",
        params,
      });

      return;
    }

    // NORMAL HUG
    await updateHugStatus(item?.id, "seen");

    setHugsData((prev) =>
      prev.filter((hug) => hug.id !== item.id)
    );

    if (
      receiverType === "ai" ||
      receiverType === "hug_moments"
    ) {
      router.push({
        pathname: "/virtual-hug/receive-hug",
        params,
      });
    } else {
      router.push({
        pathname: "/hug_recevied",
        params,
      });
    }
  } catch (error) {
    console.error("Failed to handle hug:", error);
  }
};


const getCardTitle = (item) => {
  const responseType = item?.responsetype?.toLowerCase();
  const userName = item?.user?.name;

  if (responseType === "gratitude") {
    if (userName?.toLowerCase() === "anonymous") {
      return "Someone appreciated your hug";
    }
    return `${userName} sent gratitude for your hug`;
  }

  else if (item?.is_hug_back === true) {
    if (userName?.toLowerCase() === "anonymous") {
      return "Someone sent you a hug back";
    }
    return `${userName} hugged you back`;
  }

  return `You got a ${item?.hug_type}`;
};

  const renderHugItem = ({ item }) => (
    
    <TouchableOpacity 
      style={styles.hugCard} activeOpacity={0.8}
       onPress={() => handleHugReceive(item)}  
    >
      
      
      <LinearGradient
        colors={getHugGradient(item?.hug_type)}
        style={styles.hugGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.hugContent}>
          {/* Avatar */}
          <View style={[styles.hugavatar, { backgroundColor: getAvatarBg(item?.hug_type) }]}>
            {/* {item?.user?.profile_pic ? ( */}
              <Image
                source={{ uri: item.user.profile_pic ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" }}
                style={styles.avatarImage}
              />
            
          </View>
          
          {/* Content */}
          <View style={styles.textContainer}>
            <Text style={styles.hugType}>{getCardTitle(item)}</Text>
            <Text style={styles.message}>{item?.message}</Text>
            <Text style={styles.time}>{getRelativeTime(item?.created_at)}</Text>
          </View>
          
          {/* Chevron */}
          <Ionicons name="chevron-forward" size={24} color="#7B6BA8" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
  
  return (
    // <LinearGradient
    //   colors={['#F5D4E8', '#E8D4F5', '#D4E0F5']}
    //   style={styles.detailContainer}
    // >
      <ImageBackground
        source={require('../../../assets/images/backgrounds/Pending Hugs, Screen 6 Background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#6B4C9A" />
        </TouchableOpacity>
        <View style={styles.heartsContainer}>
          <Text style={styles.smallHeart}>💕</Text>
          <Text style={styles.bigHeart}>💗</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>
      </View>

        

          {/* Hugs List */}
          <FlatList
        data={hugsData}
        renderItem={renderHugItem}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.hugsListContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.titleContainer}>
            <Text style={styles.detailTitle}>Hugs Waiting for You</Text>
            <Text style={styles.subtitle}>Open a hug to respond when you're ready.</Text>
          </View>
        }

         ListFooterComponent={
  <>
    {/* Load More Button */}
    {currentPage < totalPages && (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={loadMore}
        disabled={loadingMore}
      >
        {loadingMore ? (
          <ActivityIndicator size="small" color="#6B4C9A" />
        ) : (
          <Text style={styles.loadMoreText}>Load More</Text>
        )}
      </TouchableOpacity>
    )}

    {/* Bottom Supportive Message */}
    <View style={styles.bottomMessageContainer}>
      <Text style={styles.cloudIcon}>☁️</Text>
      <Text style={styles.bottomMessageText}>
        Take your time. These hugs will be here{'\n'}when you're ready.
      </Text>
    </View>
  </>
}
      />
        
      </SafeAreaView>
    {/* </LinearGradient> */}
    </ImageBackground>
  );
};

interface DashboardData {
  latest_mood?: string;
  ai_interpretation?: string;
  pending_hugs?: number;
}

export default function PendingHugsScreen() {
  const [selectedTab, setSelectedTab] = useState('Receive');
  const [showDetail, setShowDetail] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoadingDashboard(true);
      const response = await getPendingHugsDashboard();
      setDashboardData(response);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Re-fetch when user returns from detail screen
  useEffect(() => {
    if (!showDetail) {
      fetchDashboard();
    }
  }, [showDetail]);

  const renderTab = (tabName: any) => (
    <TouchableOpacity
      onPress={() => setSelectedTab(tabName)}
      style={selectedTab === tabName ? styles.activeTab : styles.inactiveTab}
    >
      <Text
        style={selectedTab === tabName ? styles.activeTabText : styles.tabText}
      >
        {tabName}
      </Text>
    </TouchableOpacity>
  );

  const checkOnboardingAndNavigate = async (navigateTo: string) => {
  try {
    const response = await getVirtualHugOnboardingStatus();
    
    if (response?.virtualhug_onboard === true) {
      // Already onboarded — go to intended screen
      router.push(navigateTo as any);
    } else {
      // New user — redirect to onboarding
      router.push('/virtual-hug/Hug-onboarding'); // ← replace with your actual onboarding route
    }
  } catch (error) {
    console.log('Error checking onboarding status:', error);
    // On error navigate to intended screen so user isn't blocked
    router.push(navigateTo as any);
  }
};

  const handleHugImagePress = () => {
    setShowDetail(true);
  };

  const handleBackPress = () => {
    setShowDetail(false);
  };

  if (showDetail) {
    return <PendingHugsDetailScreen onBack={handleBackPress} />;
  }

  return (
    
    <SafeAreaView style={styles.container} >
      <ImageBackground
            source={require('../../../assets/images/backgrounds/Main Dashboard, Screen 5 Background.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
      >
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mynkl</Text>
        <Image
          source={{ uri: 'https://img.icons8.com/ios/100/user-male-circle.png' }}
          style={styles.avatar}
        />
      </View>

      {/* Mood Box */}
<View style={styles.moodBox}>
  <Text style={styles.moodText}>
    <Text style={styles.emoji}>😊</Text> You are feeling {dashboardData?.latest_mood ?? '...'}
  </Text>
  <Text style={styles.subText}>
    {dashboardData?.ai_interpretation ?? ''}
  </Text>
</View>

      {/* Nav Tabs */}
      <View style={styles.navTabs}>
        {renderTab('Send')}
        {renderTab('Receive')}
        {renderTab('Community')}
      </View>

      {/* Pending Hugs */}
      {selectedTab === 'Receive' && (
        <View style={styles.pendingContainer}>
          <Text style={styles.pendingText}>
      You have {dashboardData?.pending_hugs ?? '—'} pending hugs
    </Text>
          <Text style={styles.heart}>💗</Text>
          <TouchableOpacity onPress={handleHugImagePress}>
            <Image
              source={hugsLogo}
              style={styles.hugImage}
            />
          </TouchableOpacity>
        </View>
      )}
      {/* {selectedTab === 'Send' && (
        <View style={styles.pendingContainer}>
          <Text style={styles.pendingText}>You want to send Hug!</Text>
          <Text style={styles.heart}>💗</Text>
         <Button
            title="Send Hug"
            onPress={() => router.push('/(tabs)/hugs-selection')}
            color="#8b7cf6"
          />  
        </View>
      )}

      {selectedTab === 'Community' && (
        <View style={styles.pendingContainer}>
          <Text style={styles.pendingText}>You want to join community!</Text>
          <Text style={styles.heart}>💗</Text>
         <Button
            title="join Community"
            onPress={() => router.push('/virtual-hug/hug-community/hug-challenge')}
            color="#8b7cf6"
          />  
        </View>
      )} */}
      {selectedTab === 'Send' && (
  <View style={styles.pendingContainer}>
    <Text style={styles.pendingText}>You want to send Hug!</Text>
    <Text style={styles.heart}>💗</Text>
    <TouchableOpacity
      style={styles.sendHugButton}
      onPress={() => checkOnboardingAndNavigate('/(tabs)/hugs_selection')}
    >
      <Text style={styles.sendHugButtonText}>Send Hug</Text>
    </TouchableOpacity>
  </View>
)}

{selectedTab === 'Community' && (
  <View style={styles.pendingContainer}>
    <Text style={styles.pendingText}>You want to join community!</Text>
    <Text style={styles.heart}>💗</Text>
    <TouchableOpacity
      style={styles.sendHugButton}
      onPress={() => checkOnboardingAndNavigate('/virtual-hug/hug-community/hug-challenge')}
    >
      <Text style={styles.sendHugButtonText}>Join Community</Text>
    </TouchableOpacity>
  </View>
)}
       </ImageBackground>
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  moodBox: {
    backgroundColor: '#e2e8ff',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    
  },
  moodText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingLeft: 10,
  },
  emoji: {
    fontSize: 20,
  },
  subText: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    lineHeight: 20,
    paddingLeft: 10,
  },
  navTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  inactiveTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTab: {
    backgroundColor: '#e2e8ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  pendingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  pendingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  heart: {
    fontSize: 24,
    marginTop: 4,
  },
  hugImage: {
    width: 180,
    height: 180,
    marginTop: 20,
    resizeMode: 'contain',
  },

  // ==================== REDESIGNED DETAIL SCREEN STYLES ====================
  detailContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    marginTop: 20,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  smallHeart: {
    fontSize: 24,
    marginRight: -8,
    marginTop: 10,
  },
  bigHeart: {
    fontSize: 36,
  },
  sparkle: {
    fontSize: 16,
    position: 'absolute',
    right: -5,
    bottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#4A3B6B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7B6B9E',
    lineHeight: 22,
  },
  hugsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  hugsListContent: {
    // paddingBottom: 20,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  sendHugButton: {
  backgroundColor: '#8b7cf6',
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 12,
  marginTop: 16,
  alignItems: 'center',
},
sendHugButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

 // Redesigned Hug Card with Gradient
  hugCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  hugGradient: {
    padding: 16,
  },
  hugContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hugavatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
  },
  hugType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2D4F',
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5D4D6D',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9B8BC8',
  },

  // Bottom Supportive Message
  bottomMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 16,
    // marginHorizontal: 2,
    marginBottom: 15,
  },
  cloudIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  bottomMessageText: {
    flex: 1,
    fontSize: 14,
    color: '#7B6B9E',
    lineHeight: 20,
  },
  loadMoreButton: {
  backgroundColor: 'rgba(255,255,255,0.6)',
  borderRadius: 16,
  paddingVertical: 12,
  alignItems: 'center',
  marginHorizontal: 20,
  marginBottom: 26,
  borderWidth: 1,
  borderColor: 'rgba(107, 76, 154, 0.2)',
},
loadMoreText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#6B4C9A',
},
});