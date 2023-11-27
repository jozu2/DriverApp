import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNav from "../../component/TopNav";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { mapDarkStyle } from "../../data/mapStyle";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDestinationSchool,
  selectWaypoints,
  selectWaypointsSchool,
  setWaypointsSchool,
} from "../../Redux/navSlice";
import MapViewDirections from "react-native-maps-directions";

const ViewRouteSchool = () => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const destinationData = {
    latitude: 14.9978,
    longitude: 120.656,
    description: "Don Honorio Ventura State University",
    title: "DHVSU",
  };
  const originData = useSelector(selectDestinationSchool);
  const [editModeOn, setEditModeOn] = useState(false);
  const [showMapDir, setShowMapDir] = useState(false);
  const [saveClicked, setSavedClicked] = useState(false);
  const waypointRedux = useSelector(selectWaypointsSchool);
  const [centerLocation, setCenterLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [waypointsArray, setWaypointsArray] = useState([]);
  const [newWaypoint, setNewWaypoint] = useState({
    latitude: null,
    longitude: null,
  });
  const onRegionChange = (region) => {
    if (!editModeOn) return;
    setCenterLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNav showBurger={false} backBtn={true} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#313338",
        }}
      >
        {editModeOn && (
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
          showsUserLocation={false}
          ref={mapRef}
          customMapStyle={mapDarkStyle}
          style={{
            width: "100%",
            height: "100%",
            zIndex: -2,
          }}
          region={{
            latitude: 14.9996518,
            longitude: 120.6513158,
            latitudeDelta: 0.0541,
            longitudeDelta: 0.0541,
          }}
          onRegionChangeComplete={onRegionChange}
        >
          <Marker
            coordinate={{
              latitude: originData.latitude,
              longitude: originData.longitude,
            }}
            title={originData.title}
            pinColor="#f03f46"
          />
          <Marker
            coordinate={{
              latitude: destinationData.latitude,
              longitude: destinationData.longitude,
            }}
            title={destinationData.title}
            pinColor="#f03f46"
          />
          <MapViewDirections
            origin={{
              latitude: originData.latitude,
              longitude: originData.longitude,
            }}
            destination={{
              latitude: destinationData.latitude,
              longitude: destinationData.longitude,
            }}
            waypoints={saveClicked ? waypointsArray : waypointRedux}
            apikey="AIzaSyBVtjPXDhyI3n_xnDYYbX0lOK3zpNQg_1o"
            strokeWidth={4}
            strokeColor={editModeOn ? "rgba(0, 128, 0, 0.3)" : "#fbd306"}
            timePrecision="now"
            optimizeWaypoints={true}
            onReady={(result) => {
              if (!editModeOn) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: 60,
                    right: 5,
                    bottom: 130,
                    left: 5,
                  },
                });
              }
            }}
          />
          {showMapDir && (
            <MapViewDirections
              origin={{
                latitude: originData.latitude,
                longitude: originData.longitude,
              }}
              destination={newWaypoint}
              waypoints={waypointsArray}
              apikey="AIzaSyBVtjPXDhyI3n_xnDYYbX0lOK3zpNQg_1o"
              strokeWidth={4}
              strokeColor="#f03f46"
              timePrecision="now"
              optimizeWaypoints={true}
            />
          )}
        </MapView>
      </View>

      {waypointsArray.length > 0 && !saveClicked && (
        <TouchableOpacity
          style={{
            width: "20%",
            backgroundColor: "#f03f46",
            position: "absolute",
            bottom: 50,
            left: "7%",
            borderRadius: 10,
          }}
          onPress={() => {
            if (waypointsArray.length > 0) {
              const updatedDataArray = [...waypointsArray];
              updatedDataArray.pop();

              const lastData = updatedDataArray[updatedDataArray.length - 1];

              setWaypointsArray(updatedDataArray);
              setNewWaypoint(lastData);
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

      {!saveClicked && (
        <TouchableOpacity
          style={{
            width: editModeOn ? "30%" : "40%",
            backgroundColor: "#fbd306",
            borderWidth: 1,
            position: "absolute",
            bottom: 50,
            borderRadius: 10,
            alignSelf: "center",
          }}
          onPress={() => {
            if (!editModeOn) {
              setEditModeOn(true);
            }
            if (editModeOn) {
              setWaypointsArray((prevDataArray) => [
                ...prevDataArray,
                centerLocation,
              ]);
              setShowMapDir(true);
              setNewWaypoint(centerLocation);
            }
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              paddingVertical: 10,
              color: "black",
              fontSize: 17,
            }}
          >
            {editModeOn ? ` Set` : `Edit Waypoint`}
          </Text>
        </TouchableOpacity>
      )}

      {saveClicked && (
        <TouchableOpacity
          style={{
            width: editModeOn ? "30%" : "40%",
            backgroundColor: "#1e1f22",
            position: "absolute",
            bottom: 50,
            borderRadius: 10,
            alignSelf: "center",
          }}
          onPress={() => {
            navigation.navigate("CreateARide");
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              paddingVertical: 10,
              color: "#fbd306",
              fontSize: 17,
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      )}
      {waypointsArray.length > 0 && !saveClicked && (
        <TouchableOpacity
          style={{
            width: "20%",
            backgroundColor: "#25a45c",
            position: "absolute",
            bottom: 50,
            right: "7%",
            borderRadius: 10,
          }}
          onPress={() => {
            dispatch(setWaypointsSchool(waypointsArray));
            setSavedClicked(true);
            setEditModeOn(false);
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
            Save
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ViewRouteSchool;

const styles = StyleSheet.create({});
