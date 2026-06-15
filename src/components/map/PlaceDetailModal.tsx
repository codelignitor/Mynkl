// PlaceDetailModal.tsx

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

interface Props {
  visible: boolean;
  place: any;
  onClose: () => void;
}

const LABELS = {
  POSITIVE: {
    title: "Mostly calm and positive",
    icon: "people",
    route: "/placeSummary/Positive",
    bg: "#F2EEFF",
  },

  MIXED: {
    title: "Mixed vibes around here",
    icon: "swap-horizontal",
    route: "/placeSummary/Mixed",
    bg: "#FFF4E6",
  },

  // NEGATIVE: {
  //   title: "Low energy reported",
  //   icon: "warning",
  //   route: "/placeSummary/LowData",
  //   bg: "#FFEAEA",
  // },

  LOW_DATA: {
    title: "Not enough check-ins",
    icon: "analytics",
    route: "/placeSummary/LowData",
    bg: "#F5F5F5",
  },
};

export default function PlaceDetailModal({
  visible,
  place,
  onClose,
}: Props) {
  if (!place) return null;

  const config =
    LABELS[place.summary_label] ||
    LABELS.LOW_DATA;

  const openExplore = () => {
    onClose();

    router.push({
      pathname: config.route,

      params: {
        placeId: place.id,
        placeName: place.name,
        summary: place.summary_label,
        users: place.display_users,
        checkins: place.display_checkins,
         positiveRatio: place.positive_ratio,
         // NEW
       themes: JSON.stringify(place.themes || []),
      },
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable style={styles.card}>
          {/* Top */}

          <View style={styles.top}>
            <Image
              source={{
                uri:
                  place.image ||
                  "https://picsum.photos/400",
              }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text
                  numberOfLines={1}
                  style={styles.name}
                >
                  {place.name}
                </Text>

                <Ionicons
                  name="heart-outline"
                  size={20}
                  color="#7B61FF"
                />
              </View>

              <View style={styles.meta}>
                <Text style={styles.open}>
                  ● Open now
                </Text>

                <Text style={styles.dot}>
                  •
                </Text>

                <Text style={styles.type}>
                  {place.type || "Cafe"}
                </Text>

                <Text style={styles.dot}>
                  •
                </Text>

                <Text style={styles.distance}>
                  {place.distance || "120 m away"}
                </Text>
              </View>

              {/* Mood */}

              <View
                style={[
                  styles.summary,
                  {
                    backgroundColor:
                      config.bg,
                  },
                ]}
              >
                <Ionicons
                  name={
                    config.icon as any
                  }
                  size={18}
                  color="#6C63FF"
                />

                <View
                  style={{
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={
                      styles.summaryTitle
                    }
                  >
                    {config.title}
                  </Text>

                  <Text
                    style={
                      styles.summarySub
                    }
                  >
                    Based on{" "}
                    {
                      place.display_checkins
                    }{" "}
                    check-ins •{" "}
                    {
                      place.display_users
                    }{" "}
                    users
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* CTA */}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.action}
            >
              <Ionicons
                name="navigate"
                size={15}
                color="#7B61FF"
              />

              <Text
                style={
                  styles.actionText
                }
              >
                Directions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.action}
            >
              <Ionicons
                name="bookmark"
                size={15}
                color="#7B61FF"
              />

              <Text
                style={
                  styles.actionText
                }
              >
                Save place
              </Text>
            </TouchableOpacity>

            <LinearGradient
              colors={[
                "#7B61FF",
                "#9B8FFF",
              ]}
              style={
                styles.explore
              }
            >
              <TouchableOpacity
                style={
                  styles.exploreInner
                }
                onPress={
                  openExplore
                }
              >
                <Text
                  style={
                    styles.exploreText
                  }
                >
                  Explore vibes
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
overlay:{
flex:1,
backgroundColor:"rgba(0,0,0,.35)",
justifyContent:"flex-end",
padding:16
},

card:{
backgroundColor:"#fff",
borderRadius:22,
padding:22,
paddingBottom: 20,
marginBottom: 40
},

top:{
flexDirection:"row"
},

image:{
width:118,
height:88,
borderRadius:14,
marginRight:12
},

titleRow:{
flexDirection:"row",
justifyContent:"space-between"
},

name:{
fontSize:18,
fontWeight:"700"
},

meta:{
flexDirection:"row",
marginTop:6,
alignItems:"center"
},

open:{
color:"#52C36A",
fontSize:12
},

dot:{
marginHorizontal:5,
color:"#999"
},

type:{
fontSize:12,
color:"#666"
},

distance:{
fontSize:12,
color:"#666"
},

summary:{
marginTop:12,
padding:12,
borderRadius:14,
flexDirection:"row"
},

summaryTitle:{
fontWeight:"700",
fontSize:13
},

summarySub:{
marginTop:2,
fontSize:11,
color:"#777"
},

actions:{
marginTop:14,
flexDirection:"row",
// paddingHorizontal:5,
gap:6
},

action:{
flex:1,
height:42,
borderRadius:20,
backgroundColor:"#F7F6FD",
justifyContent:"center",
alignItems:"center",
flexDirection:"row",
gap:6
},

actionText:{
fontWeight:"600"
},

explore:{
flex:1.4,
borderRadius:20
},

exploreInner:{
height:42,
justifyContent:"center",
alignItems:"center"
},

exploreText:{
color:"#fff",
fontWeight:"700"
}
});