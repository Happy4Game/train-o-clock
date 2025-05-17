import { Button, StyleSheet, ToastAndroid } from "react-native";

import CustomTextInput from "@/components/CustomTextInput";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";

export default function SettingScreen() {
  const [apiTextField, onChangeApiTextField] = React.useState("");
  const [, setIsApiKeyFetched] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const value = await AsyncStorage.getItem("api-key");
        if (value !== null) {
          onChangeApiTextField(value);
          setIsApiKeyFetched(true);
        }
      } catch (e) {
        console.error(e);
        ToastAndroid.show("An error has been occured", ToastAndroid.SHORT);
      }
    }
    fetchData();
  }, [setIsApiKeyFetched]);

  const saveApiKeyInLocalStorage = async () => {
    try {
      await AsyncStorage.setItem("api-key", apiTextField);
      ToastAndroid.show("Api key has been saved!", ToastAndroid.SHORT);
    } catch (e) {
      console.error(e);
      ToastAndroid.show("An error has been occured", ToastAndroid.SHORT);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="steeringwheel"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedText>
        You can get your api key here:{" "}
        <ExternalLink
          href={"https://numerique.sncf.com/startup/api/token-developpeur/"}
        >
          SNCF Numériques
        </ExternalLink>
      </ThemedText>
      <CustomTextInput
        placeholder="Put your api key"
        onChangeText={onChangeApiTextField}
        value={apiTextField}
      ></CustomTextInput>
      <Button title="Save" color="green" onPress={saveApiKeyInLocalStorage} />
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
