import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import moment from "moment-timezone";
import MapViewDirections from "react-native-maps-directions";
import { Picker } from "@react-native-picker/picker";
import { selectDestination, selectOrigin } from "../../Redux/navSlice";
import { vehicles, colors } from "./../../data/colors";
const RegisterRideModal = () => {
  const navigation = useNavigation();
  const [numberOfPassenger, setNumberOfPassenger] = useState(null);
  const [showSaveBtn, setShowSaveBtn] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (selectedVehicle === "Motorcycle") {
      setNumberOfPassenger("1");
    }

    if (
      selectedVehicle !== null &&
      numberOfPassenger !== null &&
      originData.description !== null &&
      destinationData.description !== null &&
      selectedColor !== null
    ) {
      setShowSaveBtn(true);
    } else {
      setShowSaveBtn(false);
    }
  }, [
    selectedVehicle,
    selectedColor,
    numberOfPassenger,
    destinationData,
    originData,
  ]);

  const destinationData = useSelector(selectDestination);
  const originData = useSelector(selectOrigin);

  return (
    <View>
      <View style={styles.ContanerMain}>
        <Text style={styles.content}>Create A Ride</Text>

        <TextInput
          placeholder="ORIGIN: Don Honorio Ventura School"
          editable={false}
          style={[styles.inputText]}
        />
        <TouchableOpacity
          style={[
            styles.inputText,
            { backgroundColor: "gray", paddingVertical: 10 },
          ]}
          onPress={() => {
            navigation.navigate("SetMeetingPlace");
          }}
        >
          <Text
            style={{
              fontSize: 16,
              alignSelf: "center",
              color: "#121212",
              textAlign: "center",
            }}
          >
            {originData.description === null ? "" : `Meeting spot: `}
            {originData.description == null
              ? "Select meeting spot"
              : `${originData.title} - `}

            {originData.description == null ? (
              ""
            ) : (
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontSize: 13,
                  color: "#121212",
                }}
              >
                {`Edit`} <Feather name="edit-2" size={12} color={"#121212"} />
              </Text>
            )}
          </Text>
        </TouchableOpacity>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
        >
          <Text style={{ paddingRight: 10, fontSize: 17 }}>Vehicle: </Text>
          <View style={{ width: "60%" }}>
            <Picker
              selectedValue={selectedVehicle}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedVehicle(itemValue)
              }
              style={{
                borderWidth: 1,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
              }}
            >
              <Picker.Item
                label="Select"
                value={null} // Set this to null
                style={{ color: "gray", fontSize: 17 }}
              />
              {vehicles.map((vehicle, index) => (
                <Picker.Item
                  label={vehicle.label}
                  value={vehicle.value}
                  key={index}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: 15,
            alignSelf: "flex-start",
            marginLeft: 30,
          }}
        >
          <Text style={{ paddingRight: 30, fontSize: 17 }}>Seat Capacity:</Text>
          <TextInput
            style={{
              width: 100,
              borderWidth: 1,
              borderRadius: 30,
              paddingVertical: 2,
              textAlign: "center",
              fontSize: 17,
            }}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-5]/g, "");

              if (numericText.length > 0 && parseInt(numericText) !== 0) {
                setNumberOfPassenger(numericText);
              } else {
                setNumberOfPassenger("");
              }

              if (numericText.length > 0 && parseInt(numericText) !== 0) {
                Keyboard.dismiss();
              }
            }}
            editable={selectedVehicle !== "Motorcycle"}
            value={selectedVehicle === "Motorcycle" ? "1" : numberOfPassenger}
            maxLength={1}
            keyboardType="numeric"
            onFocus={() => {
              if (
                selectedVehicle !== "Motorcycle" &&
                (numberOfPassenger || numberOfPassenger === "")
              ) {
                setNumberOfPassenger("");
              }
            }}
          />
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
        >
          <Text style={{ paddingRight: 10, fontSize: 17 }}>Color: </Text>
          <View style={{ width: "40%" }}>
            <Picker
              selectedValue={selectedColor}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedColor(itemValue)
              }
              style={{
                borderWidth: 1,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
              }}
            >
              <Picker.Item
                label="Select"
                value={null} // Set this to null
                style={{ color: "gray", fontSize: 17 }}
              />
              {colors.map((color, index) => (
                <Picker.Item
                  label={color.label}
                  value={color.value}
                  key={index}
                />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.inputText,
            {
              backgroundColor: "#ebebeb",
              paddingVertical: 10,
              borderRadius: 30,
              marginBottom: 25,
            },
          ]}
          onPress={() => {
            navigation.navigate("SetDestination");
          }}
        >
          <Text
            style={{
              fontSize: 16,
              alignSelf: "center",
              color: "#121212",
              textAlign: "center",
            }}
          >
            {destinationData.description == null ? "" : `Destination: `}
            {destinationData.description == null
              ? "Choose Destination"
              : `${destinationData.title} - `}

            {destinationData.description == null ? (
              ""
            ) : (
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontSize: 13,
                  color: "#121212",
                }}
              >
                {`Edit`} <Feather name="edit-2" size={12} color={"#121212"} />
              </Text>
            )}
          </Text>
        </TouchableOpacity>

        {showSaveBtn && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 18,
                borderRadius: 10,
                marginBottom: 15,
                backgroundColor: "#b1b1b1",
                width: " 30%",
                marginRight: 15,
              }}
              onPress={() => {
                navigation.navigate("ViewRoute");
              }}
            >
              <Text
                style={{ fontSize: 17, textAlign: "center", color: "#fff" }}
              >
                View Route
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 18,
                borderRadius: 10,
                marginBottom: 15,
                backgroundColor: "#b1b1b1",
                width: " 30%",

                marginLeft: 15,
              }}
              // onPress={async () => {
              //   const manilaTimeZone = "Asia/Manila";
              //   const nowInManila = moment.tz(manilaTimeZone);
              //   const depTimeManila = moment.tz(manilaTimeZone);
              //   const dpTime = depTimeManila.add(5, "minutes").format("HH:mm:ss");
              //   const timeCreated = nowInManila.format("HH:mm:ss");
              //   try {
              //     set(ref(db, "POSTED_RIDES/" + driverProfile.id), {
              //       rideInfo: {
              //         origin: {
              //           latitude: meetingPlace.latitude,
              //           longitude: meetingPlace.longitude,
              //           description: meetingPlace.description,
              //           title: meetingPlace.title,
              //         },
              //         destination: {
              //           latitude: destinationInfo.latitude,
              //           longitude: destinationInfo.longitude,
              //           description: destinationInfo.description,
              //         },
              //         vehicle: {
              //           typeOfVehichle: selectedVehicle,
              //           seatCapacity: numberOfPassenger,
              //           SeatOccupied: 0,
              //         },
              //       },
              //       driverInfo: {
              //         driverId: driverProfile.id,
              //         fullName: `${driverProfile.info.firstName} ${driverProfile.info.lastName}`,
              //       },
              //       status: {
              //         departureTime: dpTime,
              //         timePosted: timeCreated,
              //         isStarted: false,
              //       },
              //     });

              //     dispatch(
              //       setOrigin({
              //         latitude: null,
              //         longitude: null,
              //         description: null,
              //         title: null,
              //       })
              //     );

              //     navigation.navigate("Home");
              //   } catch (error) {
              //     console.error("Error:", error);
              //   }
              // }}
            >
              <Text
                style={{ fontSize: 17, textAlign: "center", color: "#fff" }}
              >
                Post Ride
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default RegisterRideModal;

const styles = StyleSheet.create({
  content: {
    fontWeight: "bold",
    fontSize: 25,
    backgroundColor: "#ebebeb",
    width: "100%",
    paddingVertical: 25,
    marginBottom: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    textAlign: "center",
  },
  ContanerMain: {
    position: "absolute",
    width: "97%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 40,
  },
  inputText: {
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 5,
    width: "90%",
    textAlign: "center",
    borderRadius: 10,
    marginTop: 15,
  },
});
