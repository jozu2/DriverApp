import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import ShowProfile from "../../../component/ShowProfile";

const ShowList = ({ request, driverID, vehicle }) => {
  const [requestData, setRequestData] = useState(request);
  const [showProfileRequest, setShowProfileRequest] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  if (showProfileRequest) {
    return (
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "absolute",
          alignContent: "center",
          justifyContent: "center",
          paddingTop: 140,
          paddingBottom: 110,
        }}
      >
        <View
          style={{
            width: "88%",
            height: 400,
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 20,
            backgroundColor: "#fff",
            padding: 15,
            marginBottom: "25%",
          }}
        >
          <ShowProfile
            data={userProfileData}
            DriverID={driverID}
            vehicle={vehicle}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "absolute",
          alignContent: "center",
          justifyContent: "center",
          paddingTop: 140,
          paddingBottom: 110,
        }}
      >
        <View
          style={{
            width: "90%",
            height: 440,
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 20,
            backgroundColor: "#fff",
            padding: 15,
          }}
        >
          <ScrollView>
            {requestData &&
              Object.keys(requestData).map((key) => {
                const item = request[key];
                console.log(item);
                if (!item) {
                  // Skip rendering if the item is null or undefined
                  return null;
                }

                const { fullName, userID, userProfile, userCount } =
                  item.userInfo;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setShowProfileRequest(true);
                      setUserProfileData(item.userInfo);
                    }}
                    key={key}
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      backgroundColor: "#1e1f22",
                      marginTop: 15,
                      borderRadius: 23,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      height: 70,
                    }}
                  >
                    <Image
                      source={{ uri: userProfile }}
                      style={{
                        borderWidth: 3,
                        borderColor: "#8660bf",
                        width: 60,
                        height: 60,
                        marginLeft: 19,
                        borderRadius: 50,
                        backgroundColor: "#ebebeb",
                      }}
                    />
                    <View
                      style={{
                        marginLeft: 20,
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View>
                        <Text style={{ color: "#fff", fontSize: 19 }}>
                          {fullName}
                        </Text>
                        <Text
                          style={{
                            marginLeft: 5,
                            color: "#fff",
                            fontSize: 12,
                            lineHeight: 12,
                            fontWeight: "300",
                          }}
                        >
                          {userID}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 22,
                            fontWeight: "bold",
                            top: -35,
                            zIndex: 300,
                            marginLeft: 20,
                            backgroundColor: "#f03f46",
                            paddingHorizontal: 10,
                            borderRadius: 5,
                          }}
                        >
                          {userCount}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "600",
            textAlign: "center",
            color: "#fff",
            marginTop: 5,

            marginBottom: "20%",
          }}
        >
          Request List
        </Text>
      </View>
    );
  }
};

export default ShowList;

const styles = StyleSheet.create({});
