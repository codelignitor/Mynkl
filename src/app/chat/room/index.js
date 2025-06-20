import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StreamChat } from "stream-chat";
import { useRouter } from "expo-router";
import { AppContext } from "../../../contexts/AppContext";
import { useSelector } from "react-redux";
import { chatApiKey } from "../../../../chatConfig";

const client = StreamChat.getInstance(chatApiKey);

const moodData = [
  { mood: "Happy", emoji: "😊", gradient: ["#FFD166", "#FB8B24"] },
  { mood: "Lonely", emoji: "😔", gradient: ["#2D6A78", "#3D8B99"] },
  { mood: "Anxious", emoji: "😟", gradient: ["#7A5CFA", "#4C2FBD"] },
  { mood: "Calm", emoji: "😌", gradient: ["#5DC2AF", "#3B8B7A"] },
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
    return moodData[0];
  };

  const renderMoodCard = ({ item }) => {
    const mood = getMoodStyle(item.data.name);
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
            <Text style={styles.cardSub}>{item.state.members.length} people chatting</Text>
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
      <Text style={styles.appTitle}>Mynkl</Text>
      <Text style={styles.title}>Mood-Based Chat Rooms</Text>
      <Text style={styles.subtitle}>Connect with others in similar emotional states</Text>

      <FlatList
        data={channels}
        renderItem={renderMoodCard}
        keyExtractor={(item) => item.cid}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.footerCard}>
        <Text style={styles.footerText}>
          How about a happiness challenge to lift your mood? <Text>😉</Text>
        </Text>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>▶ Listen to uplifting playlist</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5f3c3c",
    padding: 20,
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
    marginTop:15,
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
  footerCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 25,
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
