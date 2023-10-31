import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";

import { db } from "../../../config";
import { off, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../Redux/navSlice";
import CreateBtn from "./CreateBtn";
import TopNav from "../../component/TopNav";
import { SafeAreaView } from "react-native-safe-area-context";
import RideDashboard from "./RideStarting/RideDashboard";
const DriverDashboard = () => {
  const driverProfile = useSelector(selectUserProfile);
  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hideCreateRideBtn, setHideCreateRideBtn] = useState(false);

  useEffect(() => {
    const dbRef = ref(db, `POSTED_RIDES/${driverProfile.id}`);

    const onDataChange = (snapshot) => {
      const requestData = snapshot.val();

      if (!requestData) {
        console.log("No data found for driver ID:", driverProfile.id);
        setIsLoading(false);
        setHideCreateRideBtn(false);
        return;
      }

      setFetchedData(requestData);
      setHideCreateRideBtn(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 1100);
    };

    const errorCallback = (error) => {
      console.error("Error:", error);
    };

    onValue(dbRef, onDataChange, errorCallback);

    return () => off(dbRef, "value", onDataChange);
  }, [driverProfile.id]);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNav showBurger={"show"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNav showBurger={true} />
      <View style={styles.loadingContainer}>
        {!hideCreateRideBtn && <CreateBtn />}
        {hideCreateRideBtn && fetchedData !== null && (
          <RideDashboard
            driverInfo={fetchedData.driverInfo}
            origin={fetchedData.rideInfo.origin}
            destinaton={fetchedData.rideInfo.destination}
            vehicle={fetchedData.rideInfo.vehicle}
            status={fetchedData.status}
            request={fetchedData.request ? fetchedData.request : null}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DriverDashboard;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#313133",
  },
});
