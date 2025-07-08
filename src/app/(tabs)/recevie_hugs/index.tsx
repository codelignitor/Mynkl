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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ← Added Ionicons
import { receiveHugsList } from '@/src/services/apis';
import { router } from 'expo-router';

const PendingHugsDetailScreen = ({ onBack }) => {

  const [hugsData , setHugsData ] = useState(null);
  const [loadig, setLoading] = useState(false);

  // const hugsData = [
  //   {
  //     id: 1,
  //     avatar: '👱‍♀️',
  //     message: 'You got a warm hug!',
  //     subMessage: "I'm here for you 💕",
  //   },
  //   {
  //     id: 2,
  //     avatar: '🧢',
  //     message: 'You got a calm hug!',
  //     subMessage: 'Everything is going to be okay',
  //   },
  //   {
  //     id: 3,
  //     avatar: '👩🏽‍🦱',
  //     message: 'You got an excited hug!',
  //     subMessage: 'You did it!👏',
  //   },
  // ];

  const receiveHugsListHandler = async ()=>{
    try {
       setLoading(true);
      const response = await receiveHugsList();
      setHugsData(response?.list);
    } catch (error) {
      
    }
    finally{
        setLoading(false);
    }
  }

  useEffect(() => {
   
    receiveHugsListHandler();
  
  }, []);

  const renderHugItem = ({ item }) => (
    <View style={styles.hugItemCard}>
      <View style={styles.hugCardContent}>
         <View style={styles.hugIcon}>
          <Image
            source={{ uri:item?.user?.profile_pic ?? 'https://cdn-icons-png.flaticon.com/512/12173/12173945.png' }}
            style={{ width: 36, height: 36 }}
          />
        </View>
       
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.hugMessage}>You got a{item?.hug_type}!</Text>
          <View style={styles.hugBubble}>
            <Text style={styles.hugSubMessage}>{item?.message}</Text>
          </View>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>💗 </Text>
          {/* <Text style={styles.avatarEmoji}>{item?.emoji} </Text> */}
        </View>
        
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6b73ff" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Pending Hugs</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={hugsData}
        renderItem={renderHugItem}
        keyExtractor={(item) => item?.id?.toString()}
        style={styles.hugsList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.replyButton}>
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendHugButton}>
          <Text style={styles.sendHugButtonText}>Send a Hug Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function PendingHugsScreen() {
  const [selectedTab, setSelectedTab] = useState('Receive');
  const [showDetail, setShowDetail] = useState(false);

  const renderTab = (tabName) => (
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
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.emoji}>😊</Text> You are feeling calm
        </Text>
        <Text style={styles.subText}>
          Take a deep breath and{'\n'}appreciate the moment.
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
          <Text style={styles.pendingText}>You have pending hugs</Text>
          <Text style={styles.heart}>💗</Text>
          <TouchableOpacity onPress={handleHugImagePress}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/12173/12173945.png' }}
              style={styles.hugImage}
            />
          </TouchableOpacity>
        </View>
      )}
      {selectedTab === 'Send' && (
        <View style={styles.pendingContainer}>
          <Text style={styles.pendingText}>You want to send Hug!</Text>
          <Text style={styles.heart}>💗</Text>
         <Button
            title="Send Hug"
            onPress={() => router.push('/hugs-selection')}
            color="#8b7cf6"
          />  
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  emoji: {
    fontSize: 20,
  },
  subText: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    lineHeight: 20,
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

  detailContainer: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  detailHeader: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a4a68',
  },
  placeholder: {
    width: 60,
  },
  hugsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Hug card
  hugItemCard: {
    marginTop:15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hugCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    // backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  hugMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  hugBubble: {
    backgroundColor: '#f4f4f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  hugSubMessage: {
    fontSize: 14,
    color: '#444',
  },
  hugIcon: {
    marginLeft: 8,
  },

  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    gap: 12,
    marginBottom: 50,
  },
  replyButton: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 16,
    backgroundColor: '#e8e8f0',
    alignItems: 'center',
  },
  replyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b6b6b',
  },
  sendHugButton: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 16,
    backgroundColor: '#8b7cf6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendHugButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
