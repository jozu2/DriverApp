import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNav from "../../../component/TopNav";
import { useEffect } from "react";
import { db } from "../../../../config";
import { off, onValue, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../Redux/navSlice";
import { useState } from "react";
import { firebase } from "../../../../config";
import { useNavigation } from "@react-navigation/native";

const RideFinishSchool = () => {
  const userReduxData = useSelector(selectUserProfile);
  const [runOneTime, setRunOneTime] = useState(true);
  const navigation = useNavigation();
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    const dbRef = ref(db, `POSTED_RIDES_TO_SCHOOL/${userReduxData.id}`);
    const onDataChange = (snapshot) => {
      const requestData = snapshot.val();
      if (!requestData) {
        console.log("No data found for driver ID:", userReduxData.id);
        navigation.navigate("Home");
        return;
      }
      setFetchedData(requestData);
    };
    onValue(dbRef, onDataChange);
    return () => off(dbRef, "value", onDataChange);
  }, [userReduxData.id]);

  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  useEffect(() => {
    if (runOneTime) {
      const isFinishedRef = ref(
        db,
        `POSTED_RIDES_TO_SCHOOL/${userReduxData.id}/status/isFinished`
      );
      set(isFinishedRef, true);
      setRunOneTime(false);
    }
  });

  const setProfile = async () => {
    const db = firebase.firestore();
    const docRef = db.collection("drivers").doc(userReduxData.id);

    const updatedData = {
      completedRide: userReduxData.info.completedRide + 1,
    };

    try {
      await docRef.update(updatedData);
      console.log("Driver's completedRide count updated successfully");
      await addHistoryRide();
    } catch (error) {
      console.error("Error updating driver's completedRide count:", error);
    }
  };

  const addHistoryRide = async () => {
    const uniqueID = makeid(10);

    try {
      if (fetchedData) {
        await set(ref(db, `RIDES_LOG/${userReduxData.id}/${uniqueID}`), {
          data: fetchedData,
          rideID: uniqueID,
        });
        console.log("History ride added successfully");
        const rideData = ref(db, `POSTED_RIDES_TO_SCHOOL/${userReduxData.id}`);
        await remove(rideData);
      }
    } catch (error) {
      console.error("Error adding history ride:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNav />
      <View style={styles.loadingContainer}>
        <View
          style={{
            backgroundColor: "#fff",
            width: "95%",
            paddingVertical: 40,
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 27, fontWeight: "bold", color: "#121212" }}>
            {`🎉   Ride Complete!   🎉`}
          </Text>
          <Text style={{ lineHeight: 14, fontSize: 14 }}>
            The Ride Has Ended
          </Text>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              backgroundColor: "#8660bf",
              paddingHorizontal: 18,
              borderRadius: 30,
              marginTop: 40,
            }}
            onPress={setProfile}
          >
            <Text style={{ color: "#fff", fontSize: 20 }}>Go Back Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RideFinishSchool;
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#313338",
  },
});
