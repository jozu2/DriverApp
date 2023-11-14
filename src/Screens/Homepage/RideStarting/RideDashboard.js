import MapView, { Marker, Polyline } from "react-native-maps";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import * as Location from "expo-location";

import { removeLabels } from "./../../../data/mapStyle";
import Entypo from "react-native-vector-icons/Entypo";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import ShowList from "./ShowList";
import Chat from "./Chat";
import moment, { now } from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRequestHide,
  selectUserProfile,
  setRequestHide,
} from "../../../Redux/navSlice";
import RideInfoModal from "./RideInfoModal";
import ShowProfileDriver from "./../../../component/ShowProfileDriver";
import { off, onValue, ref, set, remove } from "firebase/database";
import { db } from "../../../../config";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

const RideDashboard = ({
  driverInfo,
  origin,
  destinaton,
  vehicle,
  status,
  request,
  chat,
  waypoints,
}) => {
  const markerColors = ["orange", "purple", "red", "blue", "#25a45c"];
  const mapRef = useRef(null);
  const requestData = request ? Object.values(request) : [];
  const acceptedRequests = requestData.filter((item) => item.status.isAccepted);
  const DriverIDForRequest = driverInfo.driverId;
  const ongoingRequests = requestData.filter((item) => !item.status.isAccepted);
  const dontShowDecliendReq = ongoingRequests.filter(
    (item) => !item.status.isDeclined
  );
  const navigation = useNavigation();
  const userReduxData = useSelector(selectUserProfile);
  const hideProfile = useSelector(selectRequestHide);
  const [showList, setShowList] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRideInfo, setShowRideInfo] = useState(false);
  const [showAcceptedUser, setShowAcceptedUser] = useState(false);
  const [savedAcceptedUserData, setSavedAcceptedUserData] = useState(null);
  const [changed, setChanged] = useState(false);

  const [rideInfo, setRideInfo] = useState({
    duration: "",
    distance: "",
    description: "",
  });
  const [prevMessages, setPrevMessages] = useState([]);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  function calculateTimeDifference(time1, time2) {
    const time1Parts = time1.split(":");
    const time2Parts = time2.split(":");
    const date1 = new Date(
      0,
      0,
      0,
      time1Parts[0],
      time1Parts[1],
      time1Parts[2]
    );
    const date2 = new Date(
      0,
      0,
      0,
      time2Parts[0],
      time2Parts[1],
      time2Parts[2]
    );
    const timeDifferenceMs = date2 - date1;
    const timeDifferenceMinutes = timeDifferenceMs / (1000 * 60);
    return timeDifferenceMinutes;
  }
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      const manilaTimeZone = "Asia/Manila";
      const nowInManila = moment.tz(manilaTimeZone);
      const timeCreated = nowInManila.format("HH:mm:ss");
      const departureTime = status.departureTime;
      const currentTime = timeCreated;
      const totalPassenger = vehicle.SeatOccupied;
      if (currentTime <= departureTime) {
        const remainingMinutes = calculateTimeDifference(
          currentTime,
          departureTime
        );
        console.log(totalPassenger);
        const totalSeconds = Math.round(remainingMinutes * 60);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        setMinutes(minutes);
        setSeconds(seconds);
      } else {
        console.log("Timer has already passed.");
        if (totalPassenger <= 0) {
          Alert.alert(
            "Ride Deleted",
            "Posting time runs out, please reate a new one"
          );
          const requestDocRef = ref(db, `POSTED_RIDES/${userReduxData.id}`);
          remove(requestDocRef);
        } else {
          const dataStatus = ref(
            db,
            `POSTED_RIDES/${userReduxData.id}/status/isStarted`
          );
          set(dataStatus, true);
        }
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status.departureTime, vehicle.SeatOccupied]);
  useEffect(() => {
    if (!status.isStarted) return;

    const fetchData = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const locationDetails = location;

        if (locationDetails) {
          mapRef.current.fitToCoordinates(
            [
              {
                latitude: locationDetails.coords.latitude,
                longitude: locationDetails.coords.longitude,
              },
            ],
            {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            }
          );
          const originLatitude = ref(
            db,
            `POSTED_RIDES/${userReduxData.id}/rideInfo/origin/latitude`
          );
          set(originLatitude, locationDetails.coords.latitude);

          const originLongitude = ref(
            db,
            `POSTED_RIDES/${userReduxData.id}/rideInfo/origin/longitude`
          );
          set(originLongitude, locationDetails.coords.longitude);
        }
        console.log(rideInfo.distance);

        if (rideInfo.distance <= 0.3) {
          navigation.navigate("RideFinish");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        clearInterval(interval);
      }
    };

    const interval = setInterval(async () => {
      await fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [status.isStarted, rideInfo.distance]);

  useEffect(() => {
    if (hideProfile) {
      setShowList(false);
      setShowAcceptedUser(false);
      setShowChat(false);
      setTimeout(() => {
        dispatch(setRequestHide(false));
      }, 100);
    }
  }, [hideProfile]);
  useEffect(
    () => {
      if (chat) {
        const dbRef = ref(db, `POSTED_RIDES/${userReduxData.id}/chat/`);
        const onDataChanged = (snapshot) => {
          const chatData = snapshot.val();

          if (chatData) {
            const currentMessages = Object.values(chatData);

            if (currentMessages.length !== prevMessages.length) {
              setChanged(true);
              setPrevMessages(currentMessages);
            }
          }
        };

        onValue(dbRef, onDataChanged);

        return () => off(dbRef, onDataChanged);
      }
    },
    [chat, userReduxData.id],
    prevMessages
  );
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {showList && (
        <>
          <ShowList
            request={dontShowDecliendReq}
            driverID={DriverIDForRequest}
            vehicle={vehicle}
          />
          <EvilIcons
            style={{
              position: "absolute",
              zIndex: 30,
              bottom: 30,
              alignSelf: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: 9,
              borderRadius: 30,
            }}
            name={"close"}
            size={50}
            color={"#ebebeb"}
            onPress={() => setShowList(false)}
          />
        </>
      )}
      {showChat && (
        <>
          <Chat />
        </>
      )}
      {showRideInfo && (
        <>
          <RideInfoModal
            origin={origin}
            destination={destinaton}
            vehicle={vehicle}
            status={status}
            rideInfo={rideInfo ? rideInfo : null}
            driverProfile={driverInfo}
          />
          <EvilIcons
            style={{
              position: "absolute",
              zIndex: 30,
              bottom: 30,
              alignSelf: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: 9,
              borderRadius: 30,
            }}
            name={"close"}
            size={50}
            color={"#ebebeb"}
            onPress={() => setShowRideInfo(false)}
          />
        </>
      )}
      {showAcceptedUser && (
        <>
          <ShowProfileDriver
            data={savedAcceptedUserData}
            vehicle={vehicle}
            status={status}
          />
          <EvilIcons
            style={{
              position: "absolute",
              zIndex: 30,
              bottom: 30,
              alignSelf: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: 9,
              borderRadius: 30,
            }}
            name={"close"}
            size={50}
            color={"#ebebeb"}
            onPress={() => setShowAcceptedUser(false)}
          />
        </>
      )}
      <View
        style={{
          width: "96%",
          height: "60%",
          backgroundColor: "#ebebeb",
          alignSelf: "center",
          borderRadius: 10,
          marginTop: "15%",
        }}
      >
        <View
          style={{
            width: "50%",
            height: 60,
            backgroundColor: "gray",
            borderRadius: 11,
            borderTopColor: "#fff",
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderColor: "#fff",
            borderTopEndRadius: 30,
            borderBottomStartRadius: 30,
            position: "absolute",
            top: -30,
            zIndex: 3,

            alignSelf: "center",
          }}
        >
          {!status.isStarted && (
            <Text
              style={{
                textAlign: "center",
                fontSize: 22,
                marginTop: 6,
                color: "#fff",
              }}
            >
              {`${minutes}:${seconds}`}
            </Text>
          )}
          <Animatable.Text
            animation="fadeIn"
            iterationCount="infinite"
            style={{
              textAlign: "center",
              fontSize: status.isStarted ? 19 : 14,
              lineHeight: status.isStarted ? 21 : 14,
              color: "#fff",
              marginTop: status.isStarted ? 18 : 0,
            }}
          >
            {status.isStarted ? "  Ride Started" : "  Waiting"}
          </Animatable.Text>
        </View>
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            alignItems: "center",
            top: "40%",
            right: 15,
          }}
        >
          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => {
              setShowRideInfo(true);
            }}
          >
            <MaterialCommunityIcons
              name="clipboard-text"
              size={50}
              color={"#302c34"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => {
              setShowChat(true);
              setChanged(false);
            }}
          >
            <Entypo name="chat" size={47} color={"#302c34"} />
            {changed && (
              <Text
                style={{
                  backgroundColor: "#f03f46",
                  color: "#fff",
                  textAlign: "center",
                  width: 15,
                  height: 15,
                  borderRadius: 20,
                  position: "absolute",
                  right: -10,
                }}
              ></Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => {
              setShowList(true);
            }}
          >
            <Octicons name="list-ordered" size={47} color={"#302c34"} />
            {dontShowDecliendReq.length !== 0 && (
              <Text
                style={{
                  backgroundColor: "#f03f46",
                  color: "#fff",
                  textAlign: "center",
                  width: 20,
                  borderRadius: 20,
                  position: "absolute",
                  right: -10,
                }}
              >
                {dontShowDecliendReq.length}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderWidth: 2,
            borderRadius: 20,
            borderColor: "transparent",
          }}
        >
          <MapView
            showsMyLocationButton={false}
            showsUserLocation={status.isStarted}
            zoomControlEnabled={false}
            ref={mapRef}
            customMapStyle={removeLabels}
            style={{
              width: "100%",
              height: "100%",
              zIndex: 2,
            }}
            region={{
              latitude: origin.latitude,
              longitude: origin.longitude,
              latitudeDelta: status.isStarted ? 0.01 : 0.031,
              longitudeDelta: status.isStarted ? 0.01 : 0.031,
            }}
          >
            <Marker
              style={{ width: 200, height: 200 }}
              coordinate={{
                latitude: destinaton.latitude,
                longitude: destinaton.longitude,
              }}
            >
              <Image
                source={require("./../../../assets/iconDestination.png")}
                style={{
                  width: 40,
                  height: 50,
                  alignSelf: "center",
                  position: "absolute",
                  bottom: 0,
                }}
              />
            </Marker>
            {status.isStarted === false && (
              <Marker
                style={{ width: 200, height: 200 }}
                coordinate={{
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                }}
              >
                <Image
                  source={require("./../../../assets/iconOrigin.png")}
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
            <MapViewDirections
              origin={{
                latitude: origin.latitude,
                longitude: origin.longitude,
              }}
              destination={{
                latitude: destinaton.latitude,
                longitude: destinaton.longitude,
              }}
              waypoints={
                waypoints !== null
                  ? waypoints
                  : [
                      {
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                      },
                    ]
              }
              apikey="AIzaSyBVtjPXDhyI3n_xnDYYbX0lOK3zpNQg_1o"
              strokeWidth={4}
              strokeColor="#f03f46"
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
          </MapView>
        </View>
        <Text
          style={{ fontSize: 22, color: "#fff", marginTop: 15, marginLeft: 20 }}
        >
          {`  Accepted Users: ${vehicle.SeatOccupied}/${vehicle.seatCapacity}`}
        </Text>
        <View
          style={{
            width: "100%",
            height: 70,
            marginTop: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {request &&
            acceptedRequests.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 1000,
                  borderColor: markerColors[index % markerColors.length],
                  borderWidth: 2,
                  backgroundColor: "#ebebeb",
                  marginLeft: 10,
                }}
                onPress={() => {
                  setShowAcceptedUser(true);
                  setSavedAcceptedUserData(item);
                }}
              >
                <Image
                  source={{ uri: item.userInfo.userProfile }}
                  style={{
                    flex: 1,
                    backgroundColor: "#ebebeb",
                    borderRadius: 1110,
                  }}
                />
                <View
                  style={{
                    backgroundColor: "#25a45c",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 20,
                    borderRadius: 50,
                    position: "absolute",
                    bottom: -2,
                    right: 0,
                  }}
                >
                  <Text style={{ color: "#fff" }}>
                    {item.userInfo.userCount}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
        {vehicle.SeatOccupied === 0 && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete Ride",
                "Are you sure you want to delete the ride?",
                [
                  {
                    text: "No",
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: async () => {
                      try {
                        if (userReduxData.id) {
                          const rideData = ref(
                            db,
                            `POSTED_RIDES/${userReduxData.id}`
                          );
                          await remove(rideData);
                        } else {
                          console.log("No DriverPostID found in AsyncStorage");
                        }
                      } catch (error) {
                        console.error("Error removing data:", error);
                      }
                    },
                  },
                ]
              );
            }}
            style={{
              width: "30%",
              backgroundColor: "#f03f46",
              borderRadius: 30,
              alignSelf: "flex-end",
              marginRight: 20,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                color: "#ebebeb",
                paddingVertical: 12,
                fontWeight: "bold",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        )}
        {vehicle.SeatOccupied !== 0 && !status.isStarted && (
          <TouchableOpacity
            onPress={() => {
              const dataStatus = ref(
                db,
                `POSTED_RIDES/${userReduxData.id}/status/isStarted`
              );
              set(dataStatus, true);
            }}
            style={{
              width: "30%",
              backgroundColor: "#8660bf",
              borderRadius: 30,
              alignSelf: "flex-end",
              marginRight: 20,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                color: "#ebebeb",
                paddingVertical: 12,
                fontWeight: "bold",
              }}
            >
              Start
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RideDashboard;
