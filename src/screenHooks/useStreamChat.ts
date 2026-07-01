// import client, {
//   connectStreamUser,
//   createChannel,
// } from "../services/streamChatService";
import { Channel } from "stream-chat";
import client, { connectStreamUser, createChannel, getStreamToken } from "../services/StreamChatservice";

export const useStreamChat = () => {
  const startChat = async (
    currentUserId: string,
    targetUserId: string,
  ): Promise<Channel> => {

     // Fetch token here
    const streamToken = await getStreamToken(currentUserId);

    await connectStreamUser(currentUserId, streamToken);

    return await createChannel(currentUserId, targetUserId);
  };

  return {
    client,
    startChat,
  };
};