import { Image } from "expo-image";
import { Button, StyleSheet, ToastAndroid } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function HomeScreen() {
  const fetchTrainStation = async () => {
    try {
      const apiKey = await AsyncStorage.getItem("api-key");
      if (apiKey !== null) {
        const response = await axios.get(
          "https://api.sncf.com/v1/coverage/sncf/places?display_geojson=false&q=Dun&",
          { headers: { Authorization: apiKey } }
        );
        const stopAreas: any[] = [];
        response.data?.places.map((place: any) => {
          if (place.id.startsWith("stop_area:")) stopAreas.push(place);
        });

        console.log(stopAreas);
      }
    } catch (e) {
      console.error(e);
      ToastAndroid.show("An error has been occured", ToastAndroid.SHORT);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <Button title="Add a Train" onPress={fetchTrainStation}></Button>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
