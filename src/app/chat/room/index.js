import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StreamChat } from "stream-chat";
import { useRouter } from "expo-router";
import { AppContext } from "../../../contexts/AppContext";
import { useSelector } from "react-redux";
import { chatApiKey } from "../../../../chatConfig";
import Mascot from "../../../assets/svgs/mascot.svg";
import Holding from "../../../assets/svgs/hoalding.svg";

const client = StreamChat.getInstance(chatApiKey);

const moodData = [
  { mood: "Happy", emoji: "😊", gradient: ["#FFD166", "#FB8B24"] },
  { mood: "Lonely", emoji: "😔", gradient: ["#2D6A78", "#3D8B99"] },
  { mood: "Anxious", emoji: "😟", gradient: ["#7A5CFA", "#4C2FBD"] },
  { mood: "Calm", emoji: "😌", gradient: ["#5DC2AF", "#3B8B7A"] },
  { mood: "Grateful", emoji: "😌", gradient: ["#FFD166", "#FB8B24"] },
  { mood: "Sad", emoji: "😢", gradient: ["#7A5CFA", "#4C2FBD"] },
  { mood: "Frustrated", emoji: "😤", gradient: ["#FF6B6B", "#D64545"] },
];

export default function GroupChannelListScreen() {
  const { setChannel } = useContext(AppContext);
  const user_id = useSelector((state) => state.auth.user_id) || "dev-user";
  const [isReady, setIsReady] = useState(false);
  const [channels, setChannels] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const joinPublicChannels = async () => {
      try {
        if (!client.userID) return;

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

        setChannels(publicChannels);
        setIsReady(true);
      } catch (error) {
        console.error("Error connecting or joining channels", error);
      }
    };

    joinPublicChannels();
  }, [user_id]);

  const handleChannelSelect = (channel) => {
    setChannel(channel);
    router.push(`/chat/channel/${channel.cid}`);
  };

  const getMoodStyle = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("happy")) return moodData[0];
    if (lower.includes("lonely")) return moodData[1];
    if (lower.includes("anxious")) return moodData[2];
    if (lower.includes("calm")) return moodData[3];
    if (lower.includes("grateful")) return moodData[4];
    if (lower.includes("sad")) return moodData[5];
    if (lower.includes("frustrated")) return moodData[6];
    return moodData[0];
  };

  const renderMoodCard = ({ item }) => {
    const mood = getMoodStyle(item.data.name);

    const totalMembers = Object.keys(item.state.members || {}).length;

    const onlineCount = Object.values(item.state.members || {}).filter(
      (member) => member.user?.online
    ).length;

    return (
      <TouchableOpacity onPress={() => handleChannelSelect(item)} style={styles.cardWrapper}>
        <LinearGradient
          colors={mood.gradient}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.moodLeft}>
            <Text style={styles.emoji}>{mood.emoji}</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>Feelin’ {mood.mood}</Text>
            <Text style={styles.cardSub}>
               {onlineCount} people chatting
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
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
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <Text style={styles.appTitle}>Mynkl</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Mood-Based Chat Rooms</Text>
            <Text style={styles.subtitle}>Connect with others in similar emotional states</Text>
          </View>
          <Mascot width={112} height={112} style={{ marginLeft: 10 }} />
        </View>

        <FlatList
          data={channels}
          renderItem={renderMoodCard}
          keyExtractor={(item) => item.cid}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <View style={styles.footerWrapper}>
          <View style={styles.svgCircle}>
            <Holding width={98} height={98} style={{ transform: [{ rotate: "-15deg" }] }} />
          </View>

          <View style={styles.footerCard}>
            <Text style={styles.footerText}>
              How about a happiness challenge to lift your mood? <Text>😉</Text>
            </Text>
            <TouchableOpacity style={styles.footerButton} onPress={()=>  Linking.openURL('https://open.spotify.com/playlist/7wDZ5nB0Wb1tcoloILplN8')
                      }>
              <Text style={styles.footerButtonText}>▶ Listen to uplifting playlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5f3c3c",
    padding: 20,
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    alignSelf: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#ddd",
    marginBottom: 16,
  },
  cardWrapper: {
    marginTop: 15,
    marginVertical: 6,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moodLeft: {
    marginRight: 10,
  },
  emoji: {
    fontSize: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  cardSub: {
    fontSize: 13,
    color: "#f0f0f0",
  },
  arrow: {
    fontSize: 26,
    color: "#fff",
  },
  footerWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
    paddingRight: 8,
  },
  svgCircle: {
    width: 50,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 6,
  },
  footerCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
  },
  footerButton: {
    backgroundColor: "#3B8B7A",
    paddingVertical: 10,
    borderRadius: 12,
  },
  footerButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
