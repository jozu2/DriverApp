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

const ShowProfileSchool = ({ data, DriverID, vehicle }) => {
  const userCount = data.userCount;
  const userID = data;
  const seatCapacity = parseInt(vehicle.seatCapacity, 10);
  const seatOccupied = vehicle.SeatOccupied;
  const dispatch = useDispatch();
  const availableSeat = seatCapacity - seatOccupied;
  console.log(userCount > availableSeat);
  console.log(data.accID);
  const handleAccept = () => {
    if (userCount > availableSeat) {
      Alert.alert(
        "Sorry!,",
        `Your current available seat is ${availableSeat} `
      );
      return;
    }
    const path = `POSTED_RIDES_TO_SCHOOL/${DriverID}/request/${data.accID}/status`;

    const acceptRequest = ref(db, path + "/isAccepted");
    set(acceptRequest, true);

    const pathOfSeatOccupied = `POSTED_RIDES_TO_SCHOOL/${DriverID}/rideInfo/vehicle`;
    const sum = userCount + seatOccupied;
    const updateSeat = ref(db, pathOfSeatOccupied + "/SeatOccupied");
    set(updateSeat, sum);

    dispatch(setRequestHide(true));
  };
  const handleDecline = () => {
    const path = `POSTED_RIDES_TO_SCHOOL/${DriverID}/request/${data.accID}/status`;
    const declineRequest = ref(db, path + "/isDeclined");
    set(declineRequest, true);
    dispatch(setRequestHide(true));
  };
  console.log(data);
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
        source={{ uri: data.userProfile }}
        style={{
          backgroundColor: "#f03f46",
          width: 120,
          height: 120,
          borderRadius: 120,
          borderWidth: 4,
          borderColor: "#8660bf",
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
          alignSelf: "center",
          fontSize: 17,
          lineHeight: 17,
          fontWeight: "400",
        }}
      >
        {data.address}
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 17,
          fontWeight: "300",
        }}
      >
        {`BS${data.faculty}`}
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
          style={[styles.Btn, { backgroundColor: "#f03f46" }]}
        >
          <Text style={styles.text}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAccept}
          style={[styles.Btn, { backgroundColor: "#25a45c" }]}
        >
          <Text style={styles.text}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ShowProfileSchool;

const styles = StyleSheet.create({
  Btn: {
    width: "30%",
    backgroundColor: "#f03f46",
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
