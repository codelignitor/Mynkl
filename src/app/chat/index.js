import React, { useEffect, useState, useContext, useMemo } from "react";
import { SafeAreaView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { ChannelList } from "stream-chat-expo";
import { StreamChat } from "stream-chat";
import { Stack, useRouter } from "expo-router";
import { AppContext } from "../../contexts/AppContext";
import { useSelector } from "react-redux";
import { chatApiKey } from "../../../chatConfig";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/common/header";

const client = StreamChat.getInstance(chatApiKey);


export default function ChannelListScreen() {
  const { setChannel } = useContext(AppContext);
  const user_id = useSelector((state: any) => state.auth.user_id) || "dev-user";
  const [isClientReady, setIsClientReady] = useState(false);
  const router = useRouter();

  

  useEffect(() => {
    const setup = async () => {
      try {
        if (!client.userID) {
          await client.connectUser({ id: user_id, name: user_id }, client.devToken(user_id));
          console.log("User connected:", client.userID);
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

  const filters = useMemo(() => ({ members: { $in: [user_id] }, type: "messaging" }), [user_id]);
  const sort = useMemo(() => ({ last_updated: -1 }), []);
  const options = useMemo(() => ({ state: true, watch: true, presence: true }), []);

  const handleChannelSelect = (channel: any) => {
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
