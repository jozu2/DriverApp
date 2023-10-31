import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const ShowList = ({ request }) => {
  const [requestData, setRequestData] = useState(request);
  console.log("xxxxxxxxxx", requestData);
  return (
    <View
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        backgroundColor: "rgba(0, 0, 0, 0.12)",
        position: "absolute",
        alignContent: "center",
        justifyContent: "center",
        paddingTop: 140,
        paddingBottom: 110,
      }}
    >
      <View
        style={{
          width: "85%",
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
              const { description, latitude, longitude, numberOfPassenger } =
                item.requestCoordsInfo;
              const { fullName, userID } = item.userInfo;
              console.log("xxx", fullName);
              return (
                <TouchableOpacity
                  key={key}
                  style={{
                    width: "80%",
                    alignSelf: "center",
                    backgroundColor: "gray",
                    marginTop: 15,
                    borderRadius: 23,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: 70,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#696969",
                      width: 60,
                      height: 60,
                      marginLeft: 19,
                      borderRadius: 50,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "#ebebeb",
                        borderRadius: 50,
                      }}
                    ></View>
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Text style={{ color: "#fff", fontSize: 18 }}>
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
};

export default ShowList;

const styles = StyleSheet.create({});
