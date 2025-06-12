import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
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
  const [isClientReady, setIsClientReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    // const createPublicChannelIfNotExists = async () => {
    //   // Unique channel ID (must be lowercase and no spaces usually)
    //   const channelId = "feeling-calm";

    //   // Get channel instance (does not create on server yet)
    //   const channel = client.channel("team", channelId, {
    //     name: "Feeling Calm",
    //     created_by: { id: user_id },
    //     member_only: false,
    //     visibility: "public",
    //   });

    //   try {
    //     // Try to watch the channel, which will fail if channel does not exist yet
    //     await channel.watch();
    //   } catch (e) {
    //     // Channel does not exist, so create it by calling create on the channel instance
    //     await channel.create();
    //     // Add current user as member (optional because creator is added automatically)
    //     await channel.addMembers([user_id]);
    //   }

    //   return channel;
    // };

    const connectAndJoinChannels = async () => {
      try {
        // Connect the user
        await client.connectUser(
          { id: user_id, name: user_id },
          client.devToken(user_id)
        );

      // await  createPublicChannelIfNotExists ();

        // if (!isMounted) return;

        // Fetch public channels
        const publicChannels = await client.queryChannels(
          {
            type: "team",
            visibility: "public",
            member_only: false,
          },
          { last_message_at: -1 },
          { state: true, watch: true }
        );

        // Add user to any public channels they aren't a member of
        await Promise.all(
          publicChannels.map(async (channel) => {
            const isMember = channel.state.members[user_id];
            if (!isMember) {
              await channel.addMembers([user_id]);
              await channel.watch(); // Important: wait for channel update!
            }
          })
        );

        // if (!isMounted) return;

        setIsClientReady(true);
      } catch (error) {
        console.error("Error connecting or joining channels", error);
      }
    };

    connectAndJoinChannels();

    return () => {
      isMounted = false;
      // Optionally disconnect user here if needed
      // client.disconnectUser();
    };
  }, [user_id]);

  const filters = useMemo(() => ({ type: "team", members: { $in: [user_id] } }), [
    user_id,
  ]);
  const sort = { last_message_at: -1 };
  const options = { state: true, watch: true, presence: true };

  const handleChannelSelect = async (channel) => {
    setChannel(channel);
    router.push(`/chat/channel/${channel.cid}`);
  };

  if (!isClientReady || !client.userID) {
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
        // Preview={(props) => (
        //   <TouchableOpacity
        //     onPress={() => handleChannelSelect(props.channel)}
        //     style={styles.channelItem}
        //   >
        //     {props.channel.data.image ? (
        //       <Image
        //         source={{ uri: props.channel.data.image }}
        //         style={styles.channelImage}
        //       />
        //     ) : null}
        //     <Text style={styles.channelName}>
        //       {props.channel.data.name || "Unnamed Channel"}
        //     </Text>
        //     <Text style={styles.lastMessage}>
        //       {props?.latestMessagePreview?.messageObject?.text ||
        //         "No messages yet"}
        //     </Text>
        //   </TouchableOpacity>
        // )}
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
  channelItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  channelImage: {
    width: "100%",
    height: 122,
    borderRadius: 12,
    marginBottom: 8,
  },
  channelName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  lastMessage: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
});
