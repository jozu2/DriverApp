import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registrationInfo: {
    fullName: null,
    emailAdd: null,
    mobileNo: null,
    pass: null,
    selectedFaculty: null,
    address: null,
    teacherID: null,
  },

  savedImage: {
    height: null,
    uri: null,
    width: null,
  },

  origin: {
    latitude: null,
    longitude: null,
    description: null,
    title: null,
  },
  waypoints: [],
  destination: {
    latitude: null,
    longitude: null,
    description: null,
    title: null,
  },
  destination: {
    latitude: null,
    longitude: null,
    description: null,
  },
  viewBookings: null,
  userProfile: { info: null, id: null },
  createdRideInfo: {
    driverInfo: { fullName: null, driverId: null },
    origin: {
      latitude: null,
      longitude: null,
      description: null,
      img1: null,
      img2: null,
    },
    // destination: { latitude: null, longitude: null, description: null },
    // typeOfVehichle: null,
    // seatCapacity: null,
    // seatAvailable: null,
  },
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setRegistrationInfo: (state, action) => {
      state.registrationInfo = action.payload;
    },
    setSavedImage: (state, action) => {
      state.savedImage = action.payload;
    },
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },

    setDestination: (state, action) => {
      state.destination = action.payload;
    },

    setWaypoints: (state, action) => {
      state.waypoints = action.payload;
    },
    setViewBookings: (state, action) => {
      state.viewBookings = action.payload;
    },

    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },

    setCreatedRideInfo: (state, action) => {
      state.createdRideInfo = action.payload;
    },
  },
});

export const {
  setRegistrationInfo,
  setSavedImage,
  setOrigin,
  setDestination,
  setWaypoints,
  setViewBookings,
  setUserProfile,
  setCreatedRideInfo,
} = navSlice.actions;

export const selectRegistrationInfo = (state) => state.nav.registrationInfo;
export const selectOrigin = (state) => state.nav.origin;
export const selectSavedImage = (state) => state.nav.savedImage;
export const selectDestination = (state) => state.nav.destination;
export const selectWaypoints = (state) => state.nav.waypoints;
export const selectViewBookings = (state) => state.nav.viewBookings;
export const selectUserProfile = (state) => state.nav.userProfile;
export const selectCreatedRideInfo = (state) => state.nav.createdRideInfo;

export default navSlice.reducer;