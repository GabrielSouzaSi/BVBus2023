import { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View } from "react-native";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from "expo-location";

import { styles } from "./styles";

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRaf = useRef<MapView>(null);

  async function requestLocationPermission() {
    // pega o resultado da permissão fornecido pelo usuaáio
    const { granted } = await requestForegroundPermissionsAsync();

    // verifica se a permissão foi concedida
    if (granted) {
      //pega a localização do dispositivo
      const currentPosition = await getCurrentPositionAsync();

      setLocation(currentPosition);
      // console.log("Localização atual => ",currentPosition);
    }
  }

  useEffect(() => {
    //chama a função para requisitar a permissão de localização do dispositivo
    requestLocationPermission();
  }, []);

  useEffect(() => {
    // Função para observar alteração na posição do usuário
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      console.log("Nova Localização!", response);

      setLocation(response);     
      mapRaf.current?.animateCamera({
        pitch:0,
        center: response.coords,
        zoom:14
      })
    })
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
        ref={mapRaf}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
}
