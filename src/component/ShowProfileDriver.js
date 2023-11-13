import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import { useSelector, useDispatch } from "react-redux";
import { selectUserProfile } from "../Redux/navSlice";
import { db } from "../../config";
import { ref, remove, update } from "firebase/database";
import { setRequestHide } from "./../Redux/navSlice";

const ShowProfileDriver = ({ data, vehicle, status }) => {
  const driverId = useSelector(selectUserProfile);
  const seatOccupiedByUser = parseInt(data.userInfo.userCount, 10);
  const carSeat = parseInt(vehicle.SeatOccupied, 10);
  const ifDropUpdateSeatOccupied = seatOccupiedByUser - carSeat;
  const dispatch = useDispatch();
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
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignSelf: "center",
          alignItems: "center",
          marginBottom: "60%",
        }}
      >
        {data ? (
          <>
            <Text
              style={{
                fontSize: 34,
                color: "#fff",
                marginBottom: 20,

                fontWeight: "bold",
                marginTop: 100,
                alignSelf: "center",
              }}
            >
              User Profile
            </Text>
            <View
              style={{
                backgroundColor: "#fff",
                width: 340,
                justifyContent: "center",
                borderLeftWidth: 4,
                borderBottomWidth: 2,
                alignItems: "center",
                borderRadius: 20,
              }}
            >
              <Image
                source={{ uri: data.userInfo.userProfile }}
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 130,
                  borderWidth: 4,
                  borderColor: "#25a45c",
                  marginTop: 40,
                }}
              />
              <View
                style={{
                  paddingBottom: 50,
                }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "500",
                    alignSelf: "center",
                  }}
                >
                  {data.userInfo.fullName}
                </Text>
                <Text
                  style={{
                    lineHeight: 14,
                    fontSize: 14,
                    fontWeight: "400",
                    alignSelf: "center",
                  }}
                >
                  {`BS${data.userInfo.faculty} Student`}
                </Text>

                <View
                  style={{
                    top: -2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="location" size={20} color="#25a45c" />

                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "300",
                      alignSelf: "center",
                    }}
                  >
                    {data.userInfo.address}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#8660bf",
                    width: "90%",
                    alignSelf: "center",
                    borderRadius: 50,
                    position: "absolute",
                    bottom: -30,
                    borderBottomColor: "gray",
                    borderWidth: 2,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      paddingHorizontal: 54,
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "400",
                            color: "#fff",
                          }}
                        >
                          {data.userInfo.completedRide}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            color: "#ebebeb",
                          }}
                        >
                          Total Rides
                        </Text>
                      </View>
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "400",
                            color: "#fff",
                          }}
                        >
                          {data.userInfo.userCount}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            color: "#ebebeb",
                          }}
                        >
                          Passenger
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {!status.isStarted && (
              <TouchableOpacity
                style={{
                  width: "40%",
                  backgroundColor: "#f03f46",
                  borderRadius: 30,
                  paddingVertical: 10,
                  marginTop: 70,
                }}
                onPress={() => {
                  Alert.alert(
                    "Kick User",
                    "Are you sure you want to kick the user?",
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
                            if (driverId.id) {
                              const dataStatus = ref(
                                db,
                                `POSTED_RIDES/${driverId.id}/rideInfo/vehicle/`
                              );

                              await update(dataStatus, {
                                SeatOccupied: ifDropUpdateSeatOccupied,
                              });

                              const requestDocRef = ref(
                                db,
                                `POSTED_RIDES/${driverId.id}/request/${data.userInfo.accID}`
                              );
                              await remove(requestDocRef);
                              dispatch(setRequestHide(true));
                            } else {
                              console.log(
                                "No DriverPostID found in AsyncStorage"
                              );
                            }
                          } catch (error) {
                            console.error("Error removing data:", error);
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Kick
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View>
            <Text style={{ fontSize: 25, color: "#fff", marginTop: 200 }}>
              No Driver Data Found
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ShowProfileDriver;

const styles = StyleSheet.create({});
