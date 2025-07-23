import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../../../../chatConfig";
import { useSelector } from "react-redux";

const client = StreamChat.getInstance(chatApiKey);

export const ChatWrapper = ({ children }) => {
  const user_id = useSelector((state) => state.auth.user_id) || "dummy-id";
  const username = useSelector((state) => state.auth.username) || "Dummy User";
  const profileImage = useSelector((state) => state.auth.profile_picture) || null;
  const streamToken = useSelector((state) => state.auth.stream_token) ;
  const [isReady, setIsReady] = useState(false);


  

  console.log("stream chat " , streamToken)

  useEffect(() => {
    const initChat = async () => {
      if (client.userID) {
        setIsReady(true); // already connected
        return;
      }

      try {
        console.log("Connecting to Stream Chat..." , user_id, username, profileImage);
        await client.connectUser(
          { id: user_id, name: username , image: profileImage },
          streamToken 
        );
        setIsReady(true);
      } catch (error) {
        console.error("Error initializing chat client", error);
      }
    };

    initChat();

    return () => {
      // Optional, only if needed to disconnect on unmount
      // client.disconnectUser();
    };
  }, [user_id, username]);

  if (!isReady) {
    return (
      <SafeAreaView>
        <Text>Loading chat ...</Text>
      </SafeAreaView>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
};
