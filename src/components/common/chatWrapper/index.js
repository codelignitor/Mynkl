import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Chat,
  OverlayProvider,
} from "stream-chat-expo";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../../../../chatConfig";
import { useSelector } from "react-redux";

export const ChatWrapper = ({ children }) => {
  const user_id = useSelector((state) => state.auth.user_id) || "dummy-id";
  const username = useSelector((state) => state.auth.username) || "Dummy User";

  const [chatClient, setChatClient] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const client = StreamChat.getInstance(chatApiKey);

    const initChat = async () => {
      // try {
      await client.connectUser({ id: user_id, name: username }, client.devToken(user_id));

await client.wsPromise; // ← ensure WebSocket is connected

console.log('Client is connected, now querying channels');

const channels = await queryChannels({}, {}, {
  watch: true, 
  state: true,
});
console.log('Channels:', channels);

        // await Promise.all(
        //   publicChannels.map(async (channel) => {
        //     const isMember = channel.state.members[user_id];
        //     if (!isMember) {
        //       await channel.addMembers([user_id]);
        //       await channel.watch();
        //     }
        //   })
        // );

        // setChatClient(client);
        // setIsReady(true);
      // } catch (error) {
      //   console.error("Error initializing chat client", error);
      // }
    };

    initChat();

    return () => {
      client.disconnectUser();
    };
  }, [user_id, username]);

  if (!chatClient || !isReady) {
    return (
      <SafeAreaView>
        <Text>Loading chat ...</Text>
      </SafeAreaView>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={chatClient}>{children}</Chat>
    </OverlayProvider>
  );
};
