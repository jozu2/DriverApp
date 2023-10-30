import { StyleSheet } from "react-native";
import React from "react";
import Drawer from "./Drawer";
import CreateARide from "../Screens/CreateARide/CreateARide";
import SetMeetingPlace from "../Screens/CreateARide/SetMeetingPlace";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SetDestination from "../Screens/CreateARide/SetDestination";
import ViewRoute from "../Screens/CreateARide/ViewRoute";

const StackNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="UserNavHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Drawer} />
      <Stack.Screen name="CreateARide" component={CreateARide} />
      <Stack.Screen name="SetMeetingPlace" component={SetMeetingPlace} />
      <Stack.Screen name="SetDestination" component={SetDestination} />
      <Stack.Screen name="ViewRoute" component={ViewRoute} />
    </Stack.Navigator>
  );
};

export default StackNav;

const styles = StyleSheet.create({});
