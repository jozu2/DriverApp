import { StyleSheet } from "react-native";
import React from "react";
import Drawer from "./Drawer";
import CreateARide from "../Screens/CreateARide/CreateARide";
import SetMeetingPlace from "../Screens/CreateARide/SetMeetingPlace";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SetDestination from "../Screens/CreateARide/SetDestination";
import ViewRoute from "../Screens/CreateARide/ViewRoute";
import { firebase } from "./../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useState } from "react";
import { setUserProfile } from "../Redux/navSlice";
import { useDispatch } from "react-redux";

import LoadingScreen from "./../component/LoadingScreen";
import SetAvatar from "../Screens/Homepage/AvatarSetup/SetAvatar";
import RideFinish from "../Screens/Homepage/RideStarting/RideFinish";
const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchAvatar, setFetchAvatar] = useState(null);

  useEffect(() => {
    const fetchFirestoreData = async () => {
      try {
        const driverFirestore = await AsyncStorage.getItem("driverInfo");
        const parsedDriverData = JSON.parse(driverFirestore);

        if (parsedDriverData.id !== null) {
          const docRef = firebase
            .firestore()
            .collection("drivers")
            .doc(parsedDriverData.id);

          docRef.onSnapshot(async (doc) => {
            if (doc.exists) {
              const userData = doc.data();

              await AsyncStorage.setItem(
                "driverInfo",
                JSON.stringify({ info: userData, id: parsedDriverData.id })
              );

              const driverData = await AsyncStorage.getItem("driverInfo");
              const driverDataParsed = JSON.parse(driverData);

              dispatch(setUserProfile(driverDataParsed));
              setFetchAvatar(driverDataParsed.info.isAvatarSet);
              setIsLoading(false);
            }
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error checking user authentication:", error);
      }
    };

    fetchFirestoreData();
  }, [fetchAvatar, dispatch]);

  if (isLoading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  } else {
    return (
      <Stack.Navigator
        initialRouteName="UserNavHome"
        screenOptions={{ headerShown: false }}
      >
        {!fetchAvatar && (
          <Stack.Screen name="SetAvatar" component={SetAvatar} />
        )}
        <Stack.Screen name="Home" component={Drawer} />
        <Stack.Screen name="CreateARide" component={CreateARide} />
        <Stack.Screen name="SetMeetingPlace" component={SetMeetingPlace} />
        <Stack.Screen name="SetDestination" component={SetDestination} />
        <Stack.Screen name="ViewRoute" component={ViewRoute} />
        <Stack.Screen name="RideFinish" component={RideFinish} />
      </Stack.Navigator>
    );
  }
};

export default StackNav;

const styles = StyleSheet.create({});
