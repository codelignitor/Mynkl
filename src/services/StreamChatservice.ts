import { StreamChat, Channel } from "stream-chat";
import { chatApiKey } from "../../chatConfig";
import axiosInstance from "./axiosInstance";

const client = StreamChat.getInstance(chatApiKey);


// 🔑 Fetch stream token from backend
export const getStreamToken = async (
  userId: string
): Promise<string> => {
  try {
    const response = await axiosInstance.post(
      `/chat/token`,
      {
        user_id: userId,
      }
    );

    return response.data.token;
  } catch (error) {
    console.log("Get stream token error:", error);
    throw error;
  }
};

// 🔌 Connect user using  streamtoken
export const connectStreamUser = async (
  userId: string,
  streamToken: string
): Promise<StreamChat> => {
    // This can fail if another user logs in without app restart.
  if (!client.userID) {
    await client.connectUser(
      {
        id: userId,
        name: userId,
      },
      streamToken
    );
  }

  return client;
};

// export const connectStreamUser = async (
//   userId: string,
//   streamToken: string
// ): Promise<StreamChat> => {
// //Improvement: If the client is already connected to a different user, disconnect first before connecting to the new user. This can happen if a user logs out and another user logs in without restarting the app.
//   if (client.userID !== userId) {

//     if (client.userID) {
//       await client.disconnectUser();
//     }

//     await client.connectUser(
//       {
//         id: userId,
//         name: userId,
//       },
//       streamToken
//     );
//   }

//   return client;
// };

// 💬 Create channel
export const createChannel = async (
  currentUserId: string,
  targetUserId: string
): Promise<Channel> => {

  const channel = client.channel("messaging", {
    members: [currentUserId, targetUserId],
  });

  await channel.watch();

  return channel;
};
export default client;