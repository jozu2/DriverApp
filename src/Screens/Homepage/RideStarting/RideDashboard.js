import MapView, { Marker, Polyline } from "react-native-maps";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import { removeLabels } from "./../../../data/mapStyle";
import Entypo from "react-native-vector-icons/Entypo";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import ShowList from "./ShowList";
import moment, { now } from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { selectRequestHide, setRequestHide } from "../../../Redux/navSlice";

const RideDashboard = ({
  driverInfo,
  origin,
  destinaton,
  vehicle,
  status,
  request,
  waypoints,
}) => {
  const markerColors = ["orange", "purple", "red", "blue", "green"];
  const mapRef = useRef(null);
  const requestData = Object.values(request);
  const acceptedRequests = requestData.filter((item) => item.status.isAccepted);
  const DriverIDForRequest = driverInfo.driverId;
  const ongoingRequests = requestData.filter((item) => !item.status.isAccepted);
  const dontShowDecliendReq = ongoingRequests.filter(
    (item) => !item.status.isDeclined
  );
  const hideProfile = useSelector(selectRequestHide);
  const [showList, setShowList] = useState(false);
  const [rideInfo, setRideInfo] = useState({
    duration: "",
    distance: "",
    description: "",
  });

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
      console.log(currentTime <= departureTime);
      if (currentTime <= departureTime) {
        const remainingMinutes = calculateTimeDifference(
          currentTime,
          departureTime
        );
        const totalSeconds = Math.round(remainingMinutes * 60);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");

        setMinutes(minutes);
        setSeconds(seconds);
      } else {
        console.log("Departure time has already passed.");
        clearInterval(interval);
      }
    }, 1000); // Update every second (1000 milliseconds)

    return () => clearInterval(interval);
  }, [status.departureTime]);

  useEffect(() => {
    if (hideProfile) {
      setShowList(false);
      setTimeout(() => {
        dispatch(setRequestHide(false));
      }, 100);
    }
  }, [hideProfile]);
  console.log(hideProfile);
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
            backgroundColor: "#696969",
            borderRadius: 11,
            borderTopEndRadius: 30,
            borderBottomStartRadius: 30,
            position: "absolute",
            top: -30,
            zIndex: 3,

            alignSelf: "center",
          }}
        >
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
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              lineHeight: 14,
              color: "#fff",
            }}
          >
            Searching . . .
          </Text>
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
          <TouchableOpacity style={{ marginTop: 15 }}>
            <MaterialCommunityIcons
              name="clipboard-text"
              size={50}
              color={"#696969"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => {
              setShowList(true);
            }}
          >
            <Octicons name="list-ordered" size={47} color={"#696969"} />
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
            showsUserLocation={false}
            scrollEnabled={false}
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
              latitudeDelta: 0.031,
              longitudeDelta: 0.031,
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
                  : [{ latitude: origin.latitude, longitude: origin.longitude }]
              }
              apikey="AIzaSyBVtjPXDhyI3n_xnDYYbX0lOK3zpNQg_1o"
              strokeWidth={4}
              strokeColor="red"
              onReady={(result) => {
                const distance = result.distance || 0;
                const duration = result.duration || 0;
                const description = result.legs[0].end_address;

                setRideInfo({
                  duration: duration,
                  distance: distance,
                  description: description,
                });
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: 100,
                    right: 100,
                    bottom: 5,
                    left: 5,
                  },
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
                  console.log(item.userInfo.userCount);
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    backgroundColor: "#ebebeb",
                    borderRadius: 1110,
                  }}
                />
                <View
                  style={{
                    backgroundColor: "red",
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
              console.log("delete");
            }}
            style={{
              width: "30%",
              backgroundColor: "#a81421",
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
        {vehicle.SeatOccupied !== 0 && (
          <TouchableOpacity
            onPress={() => {
              console.log("he");
            }}
            style={{
              width: "30%",
              backgroundColor: "green",
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
