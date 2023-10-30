import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const UserInfoBoxModal = () => {
  return (
    <View>
      <Pressable
        style={{
          width: "100%",
          backgroundColor: "blue",
          height: "80%",
          position: "absolute",
        }}
        onPress={() => {
          console.log("hi");
        }}
      ></Pressable>
      <View
        style={{
          width: "98%",
          backgroundColor: "green",
          height: "28%",
          position: "absolute",
          alignSelf: "center",
          top: "95%",
          borderRadius: 12,
        }}
      ></View>
    </View>
  );
};

export default UserInfoBoxModal;

const styles = StyleSheet.create({});
