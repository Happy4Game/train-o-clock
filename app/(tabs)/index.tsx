import {
  Button,
  FlatList,
  Modal,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";

interface StopArea {
  id: string;
  embedded_type: string;
  name: string;
  quality: number;
  stop_area: object;
}

export default function HomeScreen() {
  const [modalAddTrainVisible, setModalAddTrainVisible] = useState(false);
  const [modalSelectStopAreaVisible, setModalSelectStopAreaVisible] =
    useState(false);
  const [town, setTown] = useState("");
  const [stopAreas, setStopAreas] = useState<StopArea[]>([]);

  const fetchTrainStation = async (query: string) => {
    try {
      const apiKey = await AsyncStorage.getItem("api-key");
      if (apiKey !== null) {
        const response = await axios.get(
          `https://api.sncf.com/v1/coverage/sncf/places?display_geojson=false&q=${query}&`,
          { headers: { Authorization: apiKey } }
        );

        const filtered = response.data?.places.filter((place: StopArea) =>
          place.id.startsWith("stop_area:")
        );
        setStopAreas(filtered);
        setModalSelectStopAreaVisible(true);
      }
    } catch (e) {
      console.error(e);
      setModalAddTrainVisible(false);
      setModalSelectStopAreaVisible(false);
      ToastAndroid.show("An error has been occured", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ paddingTop: 100 }}>
      <Button
        title="Add a train"
        onPress={() => setModalAddTrainVisible(!modalAddTrainVisible)}
      />

      <Modal
        visible={modalAddTrainVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalAddTrainVisible(!modalAddTrainVisible);
        }}
      >
        <View>
          <TextInput
            placeholder="Name of stop area"
            value={town}
            onChangeText={setTown}
            style={{ color: "grey" }}
          />
          <Button
            title="Fetch for"
            onPress={() => {
              fetchTrainStation(town);
            }}
          />
          <Button
            title="Close"
            onPress={() => setModalAddTrainVisible(!modalAddTrainVisible)}
          />
        </View>
      </Modal>

      <Modal
        visible={modalSelectStopAreaVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalSelectStopAreaVisible(!modalSelectStopAreaVisible);
        }}
      >
        <View>
          <FlatList
            data={stopAreas}
            renderItem={({ item }) => (
              <Text style={{ marginBottom: 8 }}>{item.name}</Text>
            )}
            ListEmptyComponent={
              <Text style={{ color: "gray" }}>No gare station found</Text>
            }
          />
          <Button
            title="Close"
            onPress={() =>
              setModalSelectStopAreaVisible(!modalSelectStopAreaVisible)
            }
          />
        </View>
      </Modal>
    </View>
  );
}
