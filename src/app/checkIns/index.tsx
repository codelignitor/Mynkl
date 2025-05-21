import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCheckIns } from "./useCheckIns";
import { styles } from "./index.style";
import Header from "@/src/components/common/header";
import moment from "moment";




export default function CheckInsScreen() {

    const {checkInsData , isLoading} = useCheckIns();
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.mood}>{item.mood}</Text>
        <Text style={styles.timestamp}>{moment(item.timestamp).format("YYYY-MM-DD")}</Text>
      </View>
      <Text style={styles.text}>{item.text}</Text>
      {item.location_opt_in && (
        <Text style={styles.location}>📍 Location shared</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Your Check-Ins" showBack={true} />
      
      {isLoading && <ActivityIndicator/>}
      <FlatList
        data={checkInsData ?? []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}


