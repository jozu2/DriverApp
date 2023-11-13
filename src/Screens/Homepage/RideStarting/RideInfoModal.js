import { StyleSheet, Text, View } from "react-native";
import React from "react";
import moment from "moment-timezone";
import "moment-timezone";
const RideInfoModal = ({
  origin,
  destination,
  vehicle,
  status,
  rideInfo,
  driverProfile,
}) => {
  const x = Number(rideInfo.duration.toFixed(2));
  const rideDurationConvert = Math.floor(x * 100) / 100;
  const rideKilometersConvert = Number(rideInfo.distance.toFixed(2));

  return (
    <View
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        position: "absolute",
        alignContent: "center",
        paddingTop: 140,
        paddingBottom: 110,
      }}
    >
      <View
        style={{
          width: "85%",
          height: 400,
          justifyContent: "center",
          alignSelf: "center",
          borderRadius: 4,
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          alignItems: "center",
          marginBottom: "30%",
          borderWidth: 3,
          borderTopColor: "#ebebeb",
          borderRightColor: "gray",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Ride Summary
        </Text>

        <View style={{ alignItems: "flex-start" }}>
          <Text style={styles.titles}>Meeting Place</Text>
          <Text style={styles.desc}>{`- ${origin.title}`}</Text>
          <Text style={styles.desc}>{`- ${origin.description}`}</Text>
          <Text style={[styles.titles, { marginTop: 10 }]}>Destination</Text>
          <Text style={styles.desc}>{`- ${destination.title}`}</Text>
          <Text style={styles.desc}>{`- ${rideInfo.description}`}</Text>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <View>
              <Text style={[styles.titles, { marginTop: 10 }]}>Color</Text>
              <Text
                style={[
                  styles.desc,
                  { fontSize: 14, lineHeight: 14, color: vehicle.color },
                ]}
              >
                {`    ${vehicle.color}`}
              </Text>
            </View>
            <View>
              <Text style={[styles.titles, { marginTop: 10, marginLeft: 20 }]}>
                Plate Number
              </Text>
              <Text
                style={[styles.desc, { fontSize: 18, marginLeft: 20 }]}
              >{`      ${driverProfile.plateNo}`}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 18,
            width: "100%",
            justifyContent: "space-evenly",
            marginBottom: "5%",
          }}
        >
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                fontWeight: "500",
              }}
            >{`${vehicle.typeOfVehichle}`}</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                lineHeight: 16,
                textAlign: "center",
              }}
            >
              Vehicle
            </Text>
          </View>
          <View>
            <Text
              style={{ textAlign: "center", fontSize: 15, fontWeight: "500" }}
            >{`${rideKilometersConvert} Km`}</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                lineHeight: 18,
                textAlign: "center",
              }}
            >
              Distance
            </Text>
          </View>
          <View>
            <Text
              style={{ textAlign: "center", fontSize: 15, fontWeight: "500" }}
            >{`${rideDurationConvert} min/s`}</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                lineHeight: 18,
                textAlign: "center",
              }}
            >
              Duration
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RideInfoModal;

const styles = StyleSheet.create({
  titles: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 6,
  },
  desc: {
    fontSize: 16,
    lineHeight: 17,
  },
});
