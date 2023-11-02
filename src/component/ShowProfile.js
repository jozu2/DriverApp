import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { db } from "../../config";
import { ref, set } from "firebase/database";
import { useDispatch } from "react-redux";
import { setRequestHide } from "../Redux/navSlice";

const ShowProfile = ({ data, DriverID, vehicle }) => {
  const userCount = data.userCount;
  const userID = data.userID;
  const seatCapacity = parseInt(vehicle.seatCapacity, 10);
  const seatOccupied = vehicle.SeatOccupied;
  const dispatch = useDispatch();
  const availableSeat = seatCapacity - seatOccupied;
  console.log(userCount > availableSeat);
  const handleAccept = () => {
    if (userCount > availableSeat) {
      Alert.alert(
        "Sorry!,",
        `Your current available seat is ${availableSeat} `
      );
      return;
    }
    const path = `POSTED_RIDES/${DriverID}/request/${userID}/status`;

    const acceptRequest = ref(db, path + "/isAccepted");
    set(acceptRequest, true);

    const pathOfSeatOccupied = `POSTED_RIDES/${DriverID}/rideInfo/vehicle`;
    const sum = userCount + seatOccupied;
    const updateSeat = ref(db, pathOfSeatOccupied + "/SeatOccupied");
    set(updateSeat, sum);

    dispatch(setRequestHide(true));
  };
  const handleDecline = () => {
    const path = `POSTED_RIDES/${DriverID}/request/${userID}/status`;

    const declineRequest = ref(db, path + "/isDeclined");
    set(declineRequest, true);
    dispatch(setRequestHide(true));
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ebebeb",
        borderRadius: 20,
      }}
    >
      <Image
        style={{
          backgroundColor: "red",
          width: 120,
          height: 120,
          borderRadius: 120,
          borderWidth: 2,
          borderColor: "green",
        }}
      />
      <Text
        style={{
          fontSize: 30,
          fontWeight: "600",
          color: "#121212",
          marginTop: 5,
        }}
      >
        {data.fullName}
      </Text>
      <Text
        style={{
          fontSize: 15,
          lineHeight: 15,
          fontWeight: "300",
        }}
      >
        Bachelor of Science in Information Technology
      </Text>
      <Text
        style={{
          alignSelf: "center",
          fontSize: 15,
          lineHeight: 18,
          fontWeight: "400",
        }}
      >
        {`Palat, Porac, Pampanga`}
      </Text>
      <View
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row",
          marginTop: 30,
        }}
      >
        <TouchableOpacity
          onPress={handleDecline}
          style={[styles.Btn, { backgroundColor: "red" }]}
        >
          <Text style={styles.text}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAccept}
          style={[styles.Btn, { backgroundColor: "green" }]}
        >
          <Text style={styles.text}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ShowProfile;

const styles = StyleSheet.create({
  Btn: {
    width: "30%",
    backgroundColor: "red",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 10,
    textAlign: "center",
  },
});
