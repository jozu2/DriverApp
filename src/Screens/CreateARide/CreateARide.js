import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNav from "../../component/TopNav";
import RegisterRideModal from "./RegisterRideModal";

const CreateARide = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNav showBurger={false} backBtn={true} />
      <View
        style={{
          flex: 1,
          backgroundColor: "#313133",
        }}
      >
        <RegisterRideModal />
      </View>
    </SafeAreaView>
  );
};

export default CreateARide;

const styles = StyleSheet.create({});
