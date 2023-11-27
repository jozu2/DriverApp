import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNav from "../../component/TopNav";
import RegisterRideModal from "./RegisterRideModal";
import RegisterRideModalSchool from "./RegisterRideModalSchool";

const CreateARide = () => {
  const [showRideModal, setShowRideModal] = useState(false);
  const [showRideToSchool, setShowRideToSchool] = useState(false);
  const [showRideToHome, setShowRideToHome] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNav showBurger={false} backBtn={true} />
      <View
        style={{
          flex: 1,
          backgroundColor: "#ededed",
          justifyContent: "center",
        }}
      >
        {!showRideModal && (
          <>
            <View
              style={{
                flex: 1,
                backgroundColor: "#617086",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.btn1}
                onPress={() => {
                  setShowRideModal(true);
                  setShowRideToSchool(true);
                }}
              >
                <Text style={styles.text1}>Setup ride going School</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#202020",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.btn2}
                onPress={() => {
                  setShowRideModal(true);
                  setShowRideToHome(true);
                }}
              >
                <Text style={styles.text2}>Setup ride going Home</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {showRideToSchool && <RegisterRideModalSchool />}
        {showRideToHome && <RegisterRideModal />}
      </View>
    </SafeAreaView>
  );
};

export default CreateARide;

const styles = StyleSheet.create({
  btn1: {
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 22,
    borderRadius: 30,

    marginTop: 30,
  },
  text1: {
    fontSize: 20,
    fontWeight: "500",
    color: "#121212",
  },
  btn2: {
    backgroundColor: "#fbd306",
    paddingHorizontal: 40,

    paddingVertical: 22,
    borderRadius: 30,
    marginBottom: 30,
  },
  text2: {
    color: "#121212",
    fontSize: 20,
    fontWeight: "500",
  },
});
