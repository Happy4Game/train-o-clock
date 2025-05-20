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

interface Departure {
  display_informations: {
    code: string;
    color: string;
    commercial_mode: string;
    description: string;
    direction: string;
    equipments: string[];
    headsign: string;
    label: string;
    links: {
      category: string;
      id: string;
      internal: boolean;
      rel: string;
      templated: boolean;
      type: string;
    };
    name: string;
    network: string;
    physical_mode: string;
    text_color: string;
    trip_short_name: string;
  };
  links: { id: string; type: string };
  routes: object;
  stop_date_time: {
    additional_informations: [];
    arrival_date_time: string;
    base_arrival_date_time: string;
    base_departure_date_time: string;
    data_freshness: string;
    departure_date_time: string;
  };
  stop_point: object;
}

interface ResponseNativiaDeparture {
  context: object;
  departures: Departure[];
  disruptions: [];
  exceptions: [];
  feed_publishers: [];
  links: [];
  notes: [];
  origins: string[];
  pagination: object;
  terminus: string[];
}

export default function HomeScreen() {
  const [modalAddTrainVisible, setModalAddTrainVisible] = useState(false);
  const [modalSelectStopAreaVisible, setModalSelectStopAreaVisible] =
    useState(false);
  const [town, setTown] = useState("");
  const [stopAreas, setStopAreas] = useState<StopArea[]>([]);
  const [selectedStopArea, setSelectedStopArea] = useState<StopArea>();
  const [departures, setDepartures] = useState<ResponseNativiaDeparture>();
  const [selectedDeparture, setSelectedDeparture] = useState<Departure>();

  const clearAllTempValues = () => {
    setStopAreas([]);
    setTown("");
    setSelectedStopArea(undefined);
    setDepartures(undefined);
    setSelectedDeparture(undefined);
  };

  const saveNewTrainInLocalStorage = async (
    departure: Departure | undefined
  ) => {
    try {
      if (departure === undefined) throw "Departure is null";
      const departuresListAsyncStorage = await AsyncStorage.getItem(
        "list-departures"
      );
      let departuresList: Departure[];
      if (departuresListAsyncStorage !== null) {
        departuresList = JSON.parse(departuresListAsyncStorage);
      } else {
        departuresList = [];
      }
      console.log(departuresList);
      departuresList.push(departure);
      await AsyncStorage.setItem(
        "list-departures",
        JSON.stringify(departuresList)
      );
      ToastAndroid.show("New departure has been added", ToastAndroid.SHORT);
      setModalAddTrainVisible(false);
      clearAllTempValues();
    } catch (e) {
      console.error(e);
      ToastAndroid.show("An error has been occured", ToastAndroid.SHORT);
    }
  };

  const convertNativiaDate = (nativiaDate: string) => {
    const year: string =
      nativiaDate[0] + nativiaDate[1] + nativiaDate[2] + nativiaDate[3];

    const month: string = nativiaDate[4] + nativiaDate[5];
    const day: string = nativiaDate[6] + nativiaDate[7];
    const hour: string = nativiaDate[9] + nativiaDate[10];
    const minutes: string = nativiaDate[11] + nativiaDate[12];

    return `${day}/${month} - ${hour}:${minutes}`;
  };

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
  const fetchDeparture = async () => {
    try {
      const apiKey = await AsyncStorage.getItem("api-key");
      if (apiKey !== null) {
        const response = await axios.get(
          `https://api.sncf.com/v1/coverage/sncf/stop_areas/${selectedStopArea?.id}/departures?`,
          { headers: { Authorization: apiKey } }
        );

        setDepartures(response.data);
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

      <Button
        title="Clear Cache"
        onPress={async () => {
          try {
            AsyncStorage.removeItem("list-departures");
            ToastAndroid.show("Departure list cleared", ToastAndroid.SHORT);
          } catch (error) {
            console.error(error);
            ToastAndroid.show("An error has occured", ToastAndroid.SHORT);
          }
        }}
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
          <Text>Selected stop area: {selectedStopArea?.name}</Text>
          <Button title="Fetch departures" onPress={fetchDeparture}></Button>

          <FlatList
            data={departures?.departures}
            renderItem={({ item }) => {
              const backgroundColor =
                item.display_informations.trip_short_name ===
                selectedDeparture?.display_informations.trip_short_name
                  ? "green"
                  : "white";
              return (
                <Text
                  style={{ marginBottom: 8, backgroundColor: backgroundColor }}
                  onPress={() => {
                    setSelectedDeparture(item);
                  }}
                >
                  {convertNativiaDate(item.stop_date_time.departure_date_time)}{" "}
                  {item.display_informations.direction}
                </Text>
              );
            }}
            ListEmptyComponent={
              <Text style={{ color: "gray" }}>No departure today</Text>
            }
          />
          <Button
            title="Validate choice"
            onPress={() => {
              saveNewTrainInLocalStorage(selectedDeparture);
            }}
          />
        </View>

        <Button
          title="Close"
          onPress={() => setModalAddTrainVisible(!modalAddTrainVisible)}
        />
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
            renderItem={({ item }) => {
              const backgroundColor =
                item.id === selectedStopArea?.id ? "green" : "white";
              return (
                <Text
                  style={{ marginBottom: 8, backgroundColor: backgroundColor }}
                  onPress={() => {
                    setSelectedStopArea(item);
                  }}
                >
                  {item.name}
                </Text>
              );
            }}
            ListEmptyComponent={
              <Text style={{ color: "gray" }}>No gare station found</Text>
            }
          />
          <Button
            title="Validate choice"
            onPress={() =>
              setModalSelectStopAreaVisible(!modalSelectStopAreaVisible)
            }
          />
        </View>
      </Modal>
    </View>
  );
}
