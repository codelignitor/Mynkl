import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch, // <-- added for toggle
} from "react-native";
import {
  Channel,
  MessageInput,
  MessageList,
  useAttachmentPickerContext,
  useChannelContext,
} from "stream-chat-expo";
import { router } from "expo-router";
import { AppContext } from "../../../../contexts/AppContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";

export default function ChannelScreen() {
  const { channel } = useContext(AppContext);
  const { setTopInset } = useAttachmentPickerContext();
  const headerHeight = useHeaderHeight();

  // 🔁 Add toggle state
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

  // Get online members from channel
  const members = Object.values(channel?.state?.members || {});
  const onlineMembers = members.filter(
    (m) => m.user?.online === true
  );
  console.log("Online members:", onlineMembers?.length);

  const CustomChannelHeader = () => {
    const { channel } = useChannelContext();
    const moodTitle = channel?.data?.name || "Feeling Lonely";
    const onlineCount = Object.keys(channel?.state?.members || {}).length;
    const topEmoji = "😊";

    return (
      <View
        style={{
          paddingTop:30,
          backgroundColor: "#284d66",
          // paddingBottom: 10,
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
              onPress={() => router.back()}
            />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                marginLeft: 10,
              }}
            >
              {moodTitle}
            </Text>
          </View>
          <Text style={{ fontSize: 36 }}>{topEmoji}</Text>
        </View>

        <Text style={{ color: "white", fontSize: 14, marginLeft: 20 }}>
          {onlineMembers?.length} online now
        </Text>

        {/* <View
          style={{
            backgroundColor: "white",
            alignSelf: "flex-start",
            marginTop: 12,
            marginLeft: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 15, color: "#333" }}>Hi! Here to connect?</Text>
        </View> */}

        {/* 🔘 Toggle Mood Button */}
        {/* <View
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
        </View> */}
      </View>
    );
  };

  const MoodButton = ({ icon, title, subtitle, color }) => (
    <TouchableOpacity
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
      {channel ? (
        <Channel channel={channel} keyboardVerticalOffset={headerHeight}>
          <ScrollView
            style={{ backgroundColor: "#0f2027", flexGrow: 0 }}
            // contentContainerStyle={{ paddingBottom: 10 }}
          >
            <CustomChannelHeader />

            {/* ✅ Conditional Mood Buttons */}
            {showMoodButtons && (
              <>
                <MoodButton
                  icon="😊"
                  title="Happiness Challenge"
                  subtitle="Send a friend a positive message"
                  color="#ffe066"
                />
                <MoodButton
                  icon="🧘"
                  title="Meditation Spot Nearby"
                  subtitle="Curated playlist"
                  color="#a8dadc"
                />
                <MoodButton
                  icon="🎵"
                  title="Songs to Feel Good"
                  subtitle="Curated playlist"
                  color="#bdb2ff"
                />
              </>
            )}
          </ScrollView>

          <View style={{ flex: 1 }}>
            <MessageList />
            <MessageInput giphyActive={false} setGiphyActive={false} />
          </View>
        </Channel>
      ) : null}
    </SafeAreaView>
  );
} 