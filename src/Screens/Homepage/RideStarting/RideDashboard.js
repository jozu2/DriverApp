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
const RideDashboard = ({
  driverInfo,
  origin,
  destinaton,
  vehicle,
  status,
  request,
}) => {
  const mapRef = useRef(null);
  const [showList, setShowList] = useState(false);
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {showList && (
        <>
          <ShowList request={request} />
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
            12:00
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              lineHeight: 14,
              color: "#fff",
            }}
          >
            Starting in...
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
          <TouchableOpacity style={{ marginTop: 15 }}>
            <Entypo name="chat" size={50} color={"#696969"} />
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
              apikey="AIzaSyBVtjPXDhyI3n_xnDYYbX0lOK3zpNQg_1o"
              strokeWidth={4}
              strokeColor="red"
              onReady={(result) => {
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
          <TouchableOpacity
            style={{
              height: 60,
              borderWidth: 2,
              borderColor: "#ebebeb",
              width: 60,
              backgroundColor: "#696969",
              borderRadius: 100,
              marginLeft: 10,
            }}
          ></TouchableOpacity>
        </View>
        <TouchableOpacity
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
      </View>
    </View>
  );
};

export default RideDashboard;
