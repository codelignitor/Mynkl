import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import {
  Channel,
  MessageInput,
  MessageList,
  useAttachmentPickerContext,
  useChannelContext,
  useChatContext,
} from "stream-chat-expo";
import { router } from "expo-router";
import { AppContext } from "../../../../contexts/AppContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import Mascot from "../../../../assets/svgs/mascot.svg";

export default function ChannelScreen() {
  const { channel } = useContext(AppContext);
  const { setTopInset } = useAttachmentPickerContext();
  const headerHeight = useHeaderHeight();
  const { client } = useChatContext();

  const [showMoodButtons, setShowMoodButtons] = useState(false);

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight, setTopInset]);

  if (!channel) {
    return (
      <SafeAreaView>
        <Text>Loading chat ...</Text>
      </SafeAreaView>
    );
  }

  const members = Object.values(channel?.state?.members || {});
  const onlineMembers = members.filter((m) => m.user?.online === true);
  const currentUser = client.user;

  const CustomChannelHeader = () => {
    const { channel: contextChannel } = useChannelContext();
    
    // Use the channel from context if available, otherwise fall back to the main channel
    const channelToUse = contextChannel || channel;
    
    console.log('🔍 Main channel:', channel?.id);
    console.log('🔍 Context channel:', contextChannel?.id);
    console.log('🔍 Channel to use:', channelToUse?.id);
    
    // Debug logging to see what's in the channel data
    console.log('🔍 Channel data:', channelToUse?.data);
    console.log('🔍 Channel extraData:', channelToUse?.extraData);
    console.log('🔍 Channel type:', channelToUse?.data?.channelType || channelToUse?.extraData?.channelType);
    console.log('🔍 Target user name:', channelToUse?.data?.targetUserName || channelToUse?.extraData?.targetUserName);
    console.log('🔍 Channel name:', channelToUse?.data?.name);
    console.log('🔍 Current user:', currentUser?.name || currentUser?.id);
    console.log('🔍 Channel members:', Object.keys(channelToUse?.state?.members || {}));
    
    // Use the channel name if it's a direct chat, otherwise fallback to mood title
    let channelTitle = "Feeling Lonely";
    
    // Check multiple sources for the target user name
    const targetUserName = channelToUse?.data?.targetUserName || channelToUse?.extraData?.targetUserName;
    const channelType = channelToUse?.data?.channelType || channelToUse?.extraData?.channelType;
    const channelName = channelToUse?.data?.name;
    
    if (channelType === 'direct') {
      // For direct chats, try to get the target user's name
      if (targetUserName) {
        channelTitle = `Chat with ${targetUserName}`;
      } else if (channelName) {
        channelTitle = channelName;
      } else {
        channelTitle = "Chat with User";
      }
    } else if (channelName) {
      // For other channel types, use the channel name
      channelTitle = channelName;
    }
    const memberKeys = channelToUse?.state?.members ? Object.keys(channelToUse.state.members) : [];
    const onlineCount = memberKeys.length;

    return (
      <View
        style={{
          paddingTop: 30,
          backgroundColor: "#284d66",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="chevron-back"
              size={28}
              color="white"
              onPress={() => router.push("../../chat_comments")}
              style={{ padding: 5 }}
            />
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "white",
                  marginLeft: 10,
                }}
              >
                {channelTitle}
              </Text>

              {/* Show target user info instead of current user */}
              {(() => {
                const targetUserName = channelToUse?.data?.targetUserName || channelToUse?.extraData?.targetUserName;
                const targetUserId = channelToUse?.data?.targetUserId || channelToUse?.extraData?.targetUserId;
                
                if (targetUserName && targetUserName !== 'User') {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 6,
                        marginLeft: 10,
                      }}
                    >
                      <Image
                        source={{ uri: "https://placehold.co/48x48" }}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          marginRight: 8,
                          borderWidth: 1,
                          borderColor: "#fff",
                        }}
                      />
                      <Text style={{ color: "white", fontSize: 16 }}>
                        {targetUserName}
                      </Text>
                    </View>
                  );
                }
                return null;
              })()}
            </View>
          </View>
        </View>

        <Text style={{ color: "white", fontSize: 14, marginLeft: 20 }}>
          {onlineMembers.length} online now
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
            marginLeft: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 15, color: "#333" }}>
              Hi! Here to connect?
            </Text>
          </View>

          <Mascot width={112} height={112} style={{ marginLeft: 60 }} />
        </View>

        <View
          style={{
            marginTop: 10,
            marginLeft: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, marginRight: 10 }}>
            Show Mood Options
          </Text>
          <Switch
            value={showMoodButtons}
            onValueChange={() => setShowMoodButtons((prev) => !prev)}
            thumbColor={showMoodButtons ? "#ffe066" : "#ccc"}
            trackColor={{ true: "#ffd60a", false: "#ccc" }}
          />
        </View>
      </View>
    );
  };

  const MoodButton = ({ icon, title, subtitle, color , onPress }) => (
    <TouchableOpacity
    onPress={onPress}
      style={{
        backgroundColor: color,
        padding: 15,
        borderRadius: 15,
        marginHorizontal: 20,
        marginVertical: 6,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 20, marginRight: 10 }}>{icon}</Text>
        <View>
          <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={{ color: "#333", fontSize: 13 }}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Channel channel={channel} keyboardVerticalOffset={headerHeight}>
        <CustomChannelHeader />

        {showMoodButtons && (
          <ScrollView
            style={{ backgroundColor: "#0f2027", flexGrow: 0 }}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            <MoodButton
              icon="😊"
              title="Happiness Challenge"
              subtitle="Send a friend a positive message"
              color="#ffe066"
              onPress={() => router.push("chat/happiness_challenges")}
            />
            <MoodButton
              icon="🧘"
              title="Meditation Spot Nearby"
              subtitle="Curated playlist"
              color="#a8dadc"
                onPress={() => router.push("chat/calm_spot")}
            />
            <MoodButton
              icon="🎵"
              title="Songs to Feel Good"
              subtitle="Curated playlist"
              color="#bdb2ff"
              onPress={() => Linking.openURL('https://open.spotify.com/playlist/7wDZ5nB0Wb1tcoloILplN8')}
            />
          </ScrollView>
        )}

        <View style={{ flex: 1 }}>
          <MessageList />
          <MessageInput />
        </View>
      </Channel>
    </SafeAreaView>
  );
}
