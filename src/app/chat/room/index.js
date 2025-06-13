import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ChannelList } from "stream-chat-expo";
import { StreamChat } from "stream-chat";
import { Stack, useRouter } from "expo-router";
import { AppContext } from "../../../contexts/AppContext";
import { useSelector } from "react-redux";
import Header from "../../../components/common/header";
import { chatApiKey } from "../../../../chatConfig";

const client = StreamChat.getInstance(chatApiKey);

export default function GroupChannelListScreen() {
  const { setChannel } = useContext(AppContext);
  const user_id = useSelector((state) => state.auth.user_id) || "dev-user";
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const joinPublicChannels = async () => {
      try {
        if (!client.userID) return; // avoid running too early

        const publicChannels = await client.queryChannels(
          {
            type: "team",
            visibility: "public",
            member_only: false,
          },
          { last_message_at: -1 },
          { watch: true, state: true }
        );

        await Promise.all(
          publicChannels.map(async (channel) => {
            const isMember = channel.state.members[user_id];
            if (!isMember) {
              await channel.addMembers([user_id]);
            }
          })
        );

        setIsReady(true);
      } catch (error) {
        console.error("Error connecting or joining channels", error);
      }
    };

    joinPublicChannels();
  }, [user_id]);

  const filters = useMemo(() => ({ type: "team", members: { $in: [user_id] } }), [user_id]);
  const sort = { last_message_at: -1 };
  const options = { state: true, watch: true, presence: true };

  const handleChannelSelect = (channel) => {
    setChannel(channel);
    router.push(`/chat/channel/${channel.cid}`);
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chat Rooms" />
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
