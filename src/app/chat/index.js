import React, { useEffect, useState, useContext, useMemo } from "react";
import { SafeAreaView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { ChannelList } from "stream-chat-expo";
import { StreamChat } from "stream-chat";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { AppContext } from "../../contexts/AppContext";
import { useSelector } from "react-redux";
import { chatApiKey } from "../../../chatConfig";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/common/header";

const client = StreamChat.getInstance(chatApiKey);


export default function ChannelListScreen() {
  const { setChannel } = useContext(AppContext);
  const user_id = useSelector((state) => state.auth.user_id) || "dev-user";
  const [isClientReady, setIsClientReady] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  

  useEffect(() => {
    const setup = async () => {
      try {
        if (!client.userID) {
          console.log('🔍 Connecting user with ID:', user_id);
          
          // Use proper user token instead of dev token for better permissions
          const userToken = client.devToken(user_id); // This will be replaced with proper token
          
          await client.connectUser({ 
            id: user_id, 
            name: user_id 
          }, userToken);
          
          console.log("✅ User connected:", client.userID);
          console.log('🔍 User role:', client.user?.role);
        }

        // Debug query
        // const filtersForQuery = {
        //   members: { $in: [user_id] },
        //   type: "messaging",
        // };

        // const channels = await client.queryChannels(filtersForQuery, { last_updated: -1 }, { state: true, watch: true });
        // console.log("Queried channels:", channels.length, channels.map(c => c.id));

        setIsClientReady(true);
      } catch (error) {
        Alert.alert("Error setting up chat", error.message);
        console.error(error);
      }
    };
    setup();

    return () => client.disconnectUser();
  }, [user_id]);

  // Auto-create/open a 1:1 channel when navigated with targetUserId
  useEffect(() => {
    const openDirectChat = async () => {
      try {
        if (!isClientReady) return;
        const targetUserId = params?.targetUserId;
        const targetUserName = params?.targetUserName;
        if (!targetUserId || typeof targetUserId !== 'string') return;
        if (targetUserId === user_id) return;

        // Try to get an existing channel first, or create a new one
        let channel;
        
        console.log('🔍 Current user ID:', user_id);
        console.log('🔍 Target user ID:', targetUserId);
        console.log('🔍 Client user role:', client.user?.role);
        console.log('🔍 Client user permissions:', client.user?.permissions);
        
        try {
          // First, try to query for existing channels between these users
          // We need to include the current user in the members filter to access channels
          let existingChannels = [];
          let directChannel = null;
          
          try {
            existingChannels = await client.queryChannels(
              { 
                members: { $in: [user_id] },
                type: 'messaging'
              },
              { last_updated: -1 },
              { state: true, watch: true }
            );
            
            console.log('🔍 Found existing channels:', existingChannels.length);
            console.log('🔍 Channel IDs:', existingChannels.map(ch => ch.id));
            
            // Find a channel that has exactly these two users
            directChannel = existingChannels.find(ch => {
              const memberIds = Object.keys(ch.state.members);
              console.log('🔍 Channel members:', memberIds);
              console.log('🔍 Channel type:', ch.type);
              console.log('🔍 Channel ID:', ch.id);
              
              // Check if this is a direct channel between the two users
              const isDirect = memberIds.length === 2 && 
                     memberIds.includes(user_id) && 
                     memberIds.includes(targetUserId);
              console.log('🔍 Is direct channel:', isDirect);
              return isDirect;
            });
          } catch (queryError) {
            console.log('⚠️ Query channels failed, will create new channel:', queryError);
            // Continue to channel creation
          }
          
          if (directChannel) {
            console.log('✅ Found existing direct channel:', directChannel.cid);
            channel = directChannel;
            
            // Store user info in extraData for existing channel
            channel.extraData = {
              targetUserId: targetUserId,
              targetUserName: targetUserName || 'User',
              channelType: 'direct'
            };
          } else {
            console.log('🆕 Creating new direct channel');
            console.log('🔍 Creating channel with name:', targetUserName ? `Chat with ${targetUserName}` : `Chat with ${targetUserId}`);
            // Use Stream Chat's built-in method for direct channels
            try {
              // Create channel with minimal data to avoid permission issues
              channel = client.channel('messaging', {
                members: [user_id, targetUserId],
                name: targetUserName ? `Chat with ${targetUserName}` : `Chat with ${targetUserId}`
              });
              
                             // Try to create the channel with minimal data first
               await channel.create();
               console.log('✅ Channel created successfully');
               console.log('🔍 Channel name after creation:', channel.data?.name);
               console.log('🔍 Channel data after creation:', channel.data);
               
               // After creation, try to update with additional data
               try {
                 await channel.update({
                   set: {
                     targetUserId: targetUserId,
                     targetUserName: targetUserName || 'User',
                     channelType: 'direct'
                   }
                 });
                 console.log('✅ Channel updated with custom data');
               } catch (updateError) {
                 console.log('⚠️ Could not update channel with custom data:', updateError);
               }
               
               // Also store the user info in the channel's extraData for more reliable access
               channel.extraData = {
                 targetUserId: targetUserId,
                 targetUserName: targetUserName || 'User',
                 channelType: 'direct'
               };
             } catch (createError) {
               console.log('⚠️ Channel creation failed, trying alternative approach:', createError);
               
               // Alternative: try to get a channel by ID
               const channelId = [user_id, targetUserId].sort().join('-');
               channel = client.channel('messaging', channelId, {
                 members: [user_id, targetUserId],
                 name: targetUserName ? `Chat with ${targetUserName}` : `Chat with ${targetUserId}`
               });
               
               try {
                 await channel.create();
                 console.log('✅ Alternative channel creation successful');
                 console.log('🔍 Alternative channel name after creation:', channel.data?.name);
                 console.log('🔍 Alternative channel data after creation:', channel.data);
                 
                 // Store user info in extraData for alternative channel
                 channel.extraData = {
                   targetUserId: targetUserId,
                   targetUserName: targetUserName || 'User',
                   channelType: 'direct'
                 };
               } catch (altError) {
                 console.log('❌ Alternative channel creation also failed:', altError);
                 throw altError;
               }
             }
          }
        } catch (error) {
          console.error('❌ Error with channel creation/query:', error);
          throw error;
        }
        
        // Ensure the channel is watched
        try {
          await channel.watch();
          console.log('✅ Channel watched successfully');
        } catch (watchError) {
          console.log('⚠️ Could not watch channel, but continuing:', watchError);
        }
        
        setChannel(channel);
        router.push(`/chat/channel/${channel.cid}`);
      } catch (err) {
        console.error('❌ Failed to open direct chat:', err);
        
        // Show user-friendly error message
        if (err.message?.includes('CreateDistinctChannelForOthers')) {
          Alert.alert(
            'Chat Error', 
            'Unable to start chat due to permissions. Please try again later or contact support.',
            [{ text: 'OK' }]
          );
        } else if (err.message?.includes('QueryChannels failed') || err.message?.includes('cannot be returned because you don\'t have access')) {
          Alert.alert(
            'Chat Error', 
            'Unable to access existing chats. Please try again or start a new conversation.',
            [{ text: 'OK' }]
          );
        } else if (err.message?.includes('permission') || err.message?.includes('not allowed')) {
          Alert.alert(
            'Chat Error', 
            'Permission denied. Please check your account status or contact support.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Chat Error', 
            'Failed to open chat. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }
    };
    openDirectChat();
  }, [isClientReady, params?.targetUserId, params?.targetUserName]);

  const filters = useMemo(() => ({ members: { $in: [user_id] }, type: "messaging" }), [user_id]);
  const sort = useMemo(() => ({ last_updated: -1 }), []);
  const options = useMemo(() => ({ state: true, watch: true, presence: true }), []);

  const handleChannelSelect = (channel) => {
    setChannel(channel);
    router.push(`/chat/channel/${channel.cid}`);
  };

  if (!isClientReady) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
     
      <Stack.Screen options={{ title: "Channel List" }} />
      <Header  title="Chats" showBack/>
      <ChannelList
        filters={filters}
        sort={sort}
        options={options}
        onSelect={handleChannelSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
