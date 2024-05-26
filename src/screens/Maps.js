// Map.js
import React, { useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Button, Alert } from "react-native";

const Map = () => {
  const mapRef = useRef(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 26.668365,
          longitude: 87.430496,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marker for live location */}
        {/* You can remove this marker if you want */}
        <Marker
          coordinate={{ latitude: 26.668365, longitude: 87.430496 }}
          title="My Location"
          pinColor="blue"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
});

export default Map;
