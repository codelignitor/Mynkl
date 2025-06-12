import React, { useContext, useEffect } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import {
  Channel,
  MessageInput,
  MessageList,
  ChannelHeader,
  useAttachmentPickerContext,
  useChannelContext,
} from "stream-chat-expo";
import { router, Stack } from "expo-router";
import { AppContext } from "../../../../contexts/AppContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";

export default function ChannelScreen() {
  const { channel } = useContext(AppContext);
  const { setTopInset } = useAttachmentPickerContext();
  const headerHeight = useHeaderHeight();

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

  const CustomChannelHeader = () => {
  const { channel, loading } = useChannelContext();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 10, gap: 10 }}>
        <Ionicons name="chevron-back" size={24} color="black" onPress={()=> router.back()} />
        <Image source={{uri: channel.data?.image}} style={{width:44 , height:44 , borderRadius:44}}/>
      <Text>{channel.data?.name}</Text>
      {/* <Text>{Object.keys(channel.state?.members || {}).length}</Text> */}
      <Text>
      
      </Text>
    </View>
  );
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
        
      
      {channel ? (
        <Channel channel={channel} keyboardVerticalOffset={headerHeight}>
            <CustomChannelHeader/>
          <MessageList />
          <MessageInput giphyActive={false} setGiphyActive={false} />
        </Channel>
      ) : null}
    </SafeAreaView>
  );
}