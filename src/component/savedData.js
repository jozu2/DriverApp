import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Image,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrigin,
  selectUserProfile,
  setOrigin,
} from "../../Redux/navSlice";
import Feather from "react-native-vector-icons/Feather";
import moment from "moment-timezone";
import MapViewDirections from "react-native-maps-directions";
import { db } from "../../../config";
import { ref, set } from "firebase/database";
const CreateARide = () => {
  const [waypointsArray, setWaypointsArray] = useState([]);
  const [showDir, setShowDir] = useState(false);
  const [takeCenterLoc, setTakeCenterLoc] = useState(false);
  const driverProfile = useSelector(selectUserProfile);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [numberOfPassenger, setNumberOfPassenger] = useState("");
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [centerLocation, setCenterLocation] = useState({
    latitude: 14.997609051113422,
    longitude: 120.6530592776835,
  });

  const [des, setDes] = useState({
    latitude: null,
    longitude: null,
  });
  const [rideInfo, setRideInfo] = useState({
    duration: "",
    distance: "",
    description: "",
  });
  const [destinationInfo, setDestinationInfo] = useState({
    latitude: "",
    longitude: "",
    distance: "",
    duration: "",
    description: "",
  });

  const meetingPlace = useSelector(selectOrigin);
  const navigation = useNavigation();
  const vehicles = [
    { label: "Sedan", value: "Sedan" },
    { label: "Motorcycle", value: "Motorcycle" },
    { label: "Van", value: "Van" },
    { label: "SUV", value: "SUV" },
  ];
  const onDirectionsError = (error) => {
    if (error === "ZERO_RESULTS") {
      navigation.navigate("Home");
      alert("No route found between the origin and destination.");
    } else {
      navigation.navigate("Home");

      alert("An error occurred No route found");
    }
  };
  useEffect(() => {
    if (selectedVehicle === "Motorcycle") {
      setNumberOfPassenger("1");
    }
    if (rideInfo.distance >= 40) {
      navigation.navigate("Home");
      Alert.alert(
        "Unable to drop a marker",
        "Your location/Ride is too far away."
      );
      setIsSet(false);
    }

    if (
      meetingPlace.description !== null &&
      selectedVehicle !== "" &&
      numberOfPassenger !== "" &&
      destinationInfo.description !== ""
    ) {
      setShowSaveBtn(true);
    } else {
      setShowSaveBtn(false);
    }
  }, [
    selectedVehicle,
    numberOfPassenger,
    rideInfo,
    meetingPlace,
    destinationInfo,
    waypointsArray,
  ]);
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const [isSet, setIsSet] = useState(false);
  const onRegionChange = (region) => {
    setCenterLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ebebeb",
        alignItems: "center",
      }}
    >
      {destinationOpen && !isSet && (
        <Image
          source={require("../../assets/PinDestination.png")}
          style={{
            position: "absolute",
            width: 40,
            height: 50,
            zIndex: 30,
            bottom: "50%",
          }}
        />
      )}

      <MapView
        showsMyLocationButton={false}
        showsUserLocation={true}
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",

          zIndex: -2,
        }}
        scrollEnabled={destinationOpen ? true : false}
        zoomEnabled={destinationOpen ? true : false}
        region={{
          latitude: 14.997609051113422,
          longitude: 120.6530592776835,
          latitudeDelta: 0.21,
          longitudeDelta: 0.21,
        }}
        onRegionChangeComplete={onRegionChange}
      >
        {destinationOpen && (
          <Marker
            style={{ width: 200, height: 200 }}
            coordinate={{
              latitude: 14.997609051113422,
              longitude: 120.6530592776835,
            }}
            title="DHVSU"
            identifier="origin"
            pinColor="#25a45c"
          >
            <Image
              source={require("./../../assets/SchoolIcon.png")}
              style={{
                width: 55,
                height: 55,
                alignSelf: "center",
                position: "absolute",
                bottom: 0,
              }}
            />
          </Marker>
        )}
        {destinationOpen && isSet && (
          <Marker
            style={{ width: 200, height: 200 }}
            coordinate={{
              latitude: des.latitude,
              longitude: des.longitude,
            }}
          >
            <Image
              source={require("./../../assets/PinDestination.png")}
              style={{
                width: 40,
                height: 50,
                alignSelf: "center",
                position: "absolute",
                bottom: 0,
              }}
            />
          </Marker>
        )}
        {showDir && (
          <MapViewDirections
            origin={{
              latitude: meetingPlace.latitude,
              longitude: meetingPlace.longitude,
            }}
            destination={des}
            waypoints={waypointsArray}
            onError={(error) => {
              onDirectionsError(error);
            }}
            apikey="AIzaSyBVtjPXDhyI3n_xnDYYbX0lOK3zpNQg_1o"
            strokeWidth={4}
            strokeColor="#25a45c"
            timePrecision="now"
            optimizeWaypoints={true}
            onReady={(result) => {
              const distance = result.distance || 0;
              const duration = result.duration || 0;
              const description = result.legs[0].end_address;

              setRideInfo({
                duration: duration,
                distance: distance,
                description: description,
              });
            }}
          />
        )}
      </MapView>

      {!destinationOpen && (
        <View
          style={{
            position: "absolute",
            width: "97%",
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 25,
              backgroundColor: "#ebebeb",
              width: "100%",
              paddingVertical: 25,
              marginBottom: 10,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              textAlign: "center",
            }}
          >
            Create A Ride
          </Text>
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
              if (!meetingPlace.title) {
                Alert.alert("Set Meeting Place First");
                return;
              }
              setDestinationOpen(true);
            }}
          >
            <Text style={{ fontSize: 16, alignSelf: "center", color: "#fff" }}>
              {destinationInfo.description == "" ? "" : `Destination: `}
              {destinationInfo.description == ""
                ? "Set Destination"
                : `${destinationInfo.description} - `}

              {destinationInfo.description == "" ? (
                ""
              ) : (
                <Text
                  style={{
                    textDecorationLine: "underline",
                    fontSize: 13,
                    color: "#fff",
                  }}
                >
                  {`Edit`} <Feather name="edit-2" size={12} color={"#fff"} />
                </Text>
              )}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text style={{ paddingRight: 10, fontSize: 17 }}>Vehicle: </Text>
            <View
              style={{
                width: "60%",
                borderWidth: 1,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
              }}
            >
              <Picker
                selectedValue={selectedVehicle}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedVehicle(itemValue)
                }
              >
                <Picker.Item
                  label="Select"
                  value={selectedVehicle === "" ? null : selectedVehicle}
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
            <Text style={{ paddingRight: 30, fontSize: 17 }}>
              Seat Capacity:
            </Text>
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

                // Check if you want to hide the keyboard
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
              navigation.navigate("SetMeetingPlace");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                alignSelf: "center",
                color: "black",
                textAlign: "center",
              }}
            >
              {meetingPlace.description ? (
                <Text style={{ fontSize: 14, color: "black" }}>
                  <Text style={{ fontSize: 16, color: "black" }}>
                    {`Meeting Place: ${meetingPlace.description} `}
                  </Text>
                  {"- edit"} <Feather name="edit-2" size={12} color={"black"} />
                </Text>
              ) : (
                "Set Meeting Place"
              )}
            </Text>
          </TouchableOpacity>
          {showSaveBtn && (
            <TouchableOpacity
              style={{
                paddingVertical: 18,
                borderRadius: 10,
                marginBottom: 15,
                backgroundColor: "#b1b1b1",
                width: " 50%",
              }}
              onPress={async () => {
                const manilaTimeZone = "Asia/Manila";
                const nowInManila = moment.tz(manilaTimeZone);
                const depTimeManila = moment.tz(manilaTimeZone);
                const dpTime = depTimeManila
                  .add(5, "minutes")
                  .format("HH:mm:ss");
                const timeCreated = nowInManila.format("HH:mm:ss");
                try {
                  set(ref(db, "POSTED_RIDES/" + driverProfile.id), {
                    rideInfo: {
                      origin: {
                        latitude: meetingPlace.latitude,
                        longitude: meetingPlace.longitude,
                        description: meetingPlace.description,
                        title: meetingPlace.title,
                      },
                      destination: {
                        latitude: destinationInfo.latitude,
                        longitude: destinationInfo.longitude,
                        description: destinationInfo.description,
                      },
                      vehicle: {
                        typeOfVehichle: selectedVehicle,
                        seatCapacity: numberOfPassenger,
                        SeatOccupied: 0,
                      },
                    },
                    driverInfo: {
                      driverId: driverProfile.id,
                      fullName: `${driverProfile.info.firstName} ${driverProfile.info.lastName}`,
                    },
                    status: {
                      departureTime: dpTime,
                      timePosted: timeCreated,
                      isStarted: false,
                    },
                  });

                  dispatch(
                    setOrigin({
                      latitude: null,
                      longitude: null,
                      description: null,
                      title: null,
                    })
                  );

                  navigation.navigate("Home");
                } catch (error) {
                  console.error("Error:", error);
                }
              }}
            >
              <Text
                style={{ fontSize: 17, textAlign: "center", color: "#fff" }}
              >
                Post Ride
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {waypointsArray.length > 0 && destinationOpen && (
        <TouchableOpacity
          style={{
            width: "20%",
            backgroundColor: "gray",
            position: "absolute",
            bottom: 50,
            left: "5%",
            borderRadius: 10,
          }}
          onPress={() => {
            if (waypointsArray.length > 0) {
              const updatedDataArray = [...waypointsArray];
              updatedDataArray.pop();

              const lastData = updatedDataArray[updatedDataArray.length - 1];

              setWaypointsArray(updatedDataArray);
              setDes(lastData);
            }
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              paddingVertical: 10,
              color: "#fff",
              fontSize: 17,
            }}
          >
            Undo
          </Text>
        </TouchableOpacity>
      )}
      {waypointsArray.length > 0 && destinationOpen && (
        <TouchableOpacity
          style={{
            width: "20%",
            backgroundColor: "gray",
            position: "absolute",
            bottom: 50,
            right: "5%",
            borderRadius: 10,
          }}
          onPress={() => {
            setDestinationInfo({
              latitude: centerLocation.latitude,
              longitude: centerLocation.longitude,
              distance: rideInfo.distance,
              duration: rideInfo.duration,
              description: rideInfo.description,
              waypoints: waypointsArray,
            });
            setDestinationOpen(false);
            setWaypointsArray([]);
            setDes({
              latitude: null,
              longitude: null,
            });
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              paddingVertical: 10,
              color: "#fff",
              fontSize: 17,
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      )}

      {destinationOpen && !isSet && (
        <TouchableOpacity
          style={{
            width: "40%",
            backgroundColor: "gray",
            position: "absolute",
            bottom: 50,
            borderRadius: 10,
          }}
          onPress={() => {
            setWaypointsArray((prevDataArray) => [
              ...prevDataArray,
              centerLocation,
            ]);
            setShowDir(true);
            setDes(centerLocation);
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              paddingVertical: 10,
              color: "#fff",
              fontSize: 17,
            }}
          >
            Set Waypoint
          </Text>
        </TouchableOpacity>
      )}

      {isSet && (
        <>
          <TouchableOpacity
            style={{
              width: "40%",
              backgroundColor: "gray",
              position: "absolute",
              bottom: 30,
              left: "7%",
              borderRadius: 10,
            }}
            onPress={() => {
              setIsSet(false);
              setRideInfo({ duration: "", distance: "", description: "" });
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                paddingVertical: 10,
                color: "#fff",
                fontSize: 17,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              right: "7%",
              width: "40%",
              backgroundColor: "gray",
              position: "absolute",
              bottom: 30,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                paddingVertical: 10,
                color: "#fff",
                fontSize: 17,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default CreateARide;

const styles = StyleSheet.create({
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
