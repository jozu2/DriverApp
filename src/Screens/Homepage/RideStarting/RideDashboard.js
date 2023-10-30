import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Entypo from "react-native-vector-icons/Entypo";
import { removeLabels } from "./../../../data/mapStyle";
import UserInfoBoxModal from "./UserInfoBoxModal";
import moment, { now } from "moment-timezone";
const RideDashboard = ({
  driverInfo,
  origin,
  destinaton,
  vehicle,
  status,
  request,
}) => {
  const mapRef = useRef(null);
  const [takeMarkerCoordinates, setTakeMarkerCoordinates] = useState({
    coords: {
      latitude: "",
      longitude: "",
      description: "",
      numberOfPassenger: "",
    },
    userInfo: {
      latitude: "",
      longitude: "",
      description: "",
      numberOfPassenger: "",
    },
  });
  const [requestData, setRequestData] = useState(request);
  const [showBottomBox, setShowBottomBox] = useState(false);
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const manilaTimeZone = "Asia/Manila";
  //     const nowInManila = moment.tz(manilaTimeZone);
  //     const timeCreated = nowInManila.format("HH:mm:ss");
  //     const departureTime = status.departureTime;

  //     const currentTime = timeCreated;
  //     console.log(currentTime <= departureTime);
  //     if (currentTime <= departureTime) {
  //       const remainingMinutes = calculateTimeDifference(
  //         currentTime,
  //         departureTime
  //       );
  //       const totalSeconds = Math.round(remainingMinutes * 60);
  //       const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  //       const seconds = String(totalSeconds % 60).padStart(2, "0");

  //       setMinutes(minutes);
  //       setSeconds(seconds);
  //     } else {
  //       console.log("Departure time has already passed.");
  //       clearInterval(interval);
  //     }
  //   }, 1000); // Update every second (1000 milliseconds)

  //   return () => clearInterval(interval);
  // }, [status.departureTime]);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <TouchableOpacity style={styles.mainBtn}>
        <Text style={styles.mainBtn.numTxt}>{`${minutes}:${seconds}`}</Text>
        <Text style={styles.mainBtn.txt}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.chatBtn}>
        <Entypo name="chat" size={50} color={"red"} />
      </TouchableOpacity>

      {showBottomBox && requestData !== null && (
        <Pressable
          style={{
            width: "100%",
            backgroundColor: "transparent",
            height: "80%",
            position: "absolute",
          }}
          onPress={() => {
            setShowBottomBox(false);
          }}
        ></Pressable>
      )}
      {showBottomBox && requestData !== null && (
        <View
          style={{
            width: "98%",
            backgroundColor: "green",
            height: "20%",
            position: "absolute",
            alignSelf: "center",
            top: "79%",
            borderRadius: 12,
          }}
        >
          <Image
            source={require("./../../../assets/boy3.jpg")}
            style={{
              width: 140,
              height: 140,
              borderRadius: 200,
              borderWidth: 3,
              borderColor: "green",
              bottom: 70,
              left: 20,
            }}
          ></Image>
          <TouchableOpacity
            style={{ position: "absolute", top: 20, right: 20 }}
          >
            <Text>Accept</Text>
          </TouchableOpacity>
        </View>
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
        region={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.031,
          longitudeDelta: 0.031,
        }}
      >
        {Object.keys(requestData).map((key) => {
          const marker = requestData[key];
          return (
            <Marker
              key={key}
              coordinate={{
                latitude: marker.requestCoordsInfo.latitude,
                longitude: marker.requestCoordsInfo.longitude,
              }}
              pinColor="red"
              onPress={() => {
                setTakeMarkerCoordinates({
                  coords: {
                    latitude: marker.requestCoordsInfo.latitude,
                    longitude: marker.requestCoordsInfo.longitude,
                    description: marker.requestCoordsInfo.description,
                    numberOfPassenger:
                      marker.requestCoordsInfo.numberOfPassenger,
                  },
                  userInfo: {
                    fullName: marker.userInfo.fullName,
                    userID: marker.userInfo.userID,
                  },
                });
                setShowBottomBox(true);
              }}
            />
          );
        })}

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
        <MapViewDirections
          origin={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          destination={{
            latitude: destinaton.latitude,
            longitude: destinaton.longitude,
          }}
          waypoints={[
            {
              latitude: 14.966953,
              longitude: 120.632592,
            },
            { latitude: 14.9840084, longitude: 120.6208341 },
          ]}
          apikey="AIzaSyBVtjPXDhyI3n_xnDYYbX0lOK3zpNQg_1o"
          strokeWidth={4}
          strokeColor="red"
          onReady={(result) => {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                top: 60,
                right: 5,
                bottom: 130,
                left: 5,
              },
            });
          }}
        />
      </MapView>
    </View>
  );
};

export default RideDashboard;

const styles = StyleSheet.create({
  chatBtn: { position: "absolute", top: 130, right: 25 },
  mainBtn: {
    backgroundColor: "red",
    position: "absolute",
    alignSelf: "flex-end",
    paddingVertical: 7,
    paddingHorizontal: 35,
    borderRadius: 12,
    top: 50,
    right: 10,
    txt: {
      textAlign: "center",
      fontSize: 15,
      lineHeight: 15,
    },
    numTxt: {
      fontSize: 20,
      textAlign: "center",
    },
  },
});
