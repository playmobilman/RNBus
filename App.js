import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Header from "./src/Header";
import Search from "./src/Search";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Search />
      <StatusBar backgroundColor="crimson" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "crimson",
  },
});
