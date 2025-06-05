import {
  Button,
  FlatList,
  Modal,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

import { TrainInfoItem } from "@/components/TrainInfoItem";
import {
  convertNativiaDate,
  Departure,
  ResponseNativiaDeparture,
  StopArea,
} from "@/scripts/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function HomeScreen() {
  const [modalAddTrainVisible, setModalAddTrainVisible] = useState(false);
  const [modalSelectStopAreaVisible, setModalSelectStopAreaVisible] =
    useState(false);
  const [town, setTown] = useState("");
  const [stopAreas, setStopAreas] = useState<StopArea[]>([]);
  const [selectedStopArea, setSelectedStopArea] = useState<StopArea>();
  const [departures, setDepartures] = useState<ResponseNativiaDeparture>();
  const [selectedDeparture, setSelectedDeparture] = useState<Departure>();

  const [, setIsLocalDeparturesLoaded] = React.useState(false);
  const [localDepartures, setLocalDepartures] = useState<Departure[]>();

  async function fetchLocalDepartures() {
    try {
      const value = await AsyncStorage.getItem("list-departures");
      if (value !== null) {
        setIsLocalDeparturesLoaded(true);
        setLocalDepartures(JSON.parse(value));
      }
      ToastAndroid.show("Local departures loaded", ToastAndroid.SHORT);
    } catch (e) {
      console.error(e);
      ToastAndroid.show("An error has been occured", ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    fetchLocalDepartures();
  }, [setIsLocalDeparturesLoaded]);

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
      departuresList.push(departure);
      await AsyncStorage.setItem(
        "list-departures",
        JSON.stringify(departuresList)
      );
      ToastAndroid.show("New departure has been added", ToastAndroid.SHORT);
      setModalAddTrainVisible(false);
      clearAllTempValues();
      fetchLocalDepartures();
    } catch (e) {
      console.error(e);
      ToastAndroid.show("An error has been occured", ToastAndroid.SHORT);
    }
  };

  const deleteDepartureLocalStorage = async (departure: Departure) => {
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
      if (departuresList.indexOf(departure) === -1) {
        ToastAndroid.show(
          "Departure not found in local storage",
          ToastAndroid.SHORT
        );
        return;
      }
      const newDepartureList = departuresList.splice(
        departuresList.indexOf(departure),
        1
      );

      await AsyncStorage.setItem(
        "list-departures",
        JSON.stringify(newDepartureList)
      );
      ToastAndroid.show("New departure has been added", ToastAndroid.SHORT);
      setModalAddTrainVisible(false);
      setLocalDepartures(newDepartureList);
      clearAllTempValues();
      fetchLocalDepartures();
    } catch (e) {
      console.error(e);
      ToastAndroid.show("An error has been occured", ToastAndroid.SHORT);
    }
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
            await AsyncStorage.removeItem("list-departures");
            setLocalDepartures(undefined);
            ToastAndroid.show("Departure list cleared", ToastAndroid.SHORT);
          } catch (error) {
            console.error(error);
            ToastAndroid.show("An error has occured", ToastAndroid.SHORT);
          }
        }}
      />

      <FlatList
        data={localDepartures}
        renderItem={({ item }) => (
          <TrainInfoItem
            localDeparture={item}
            deleteDeparture={() => deleteDepartureLocalStorage(item)}
          ></TrainInfoItem>
        )}
      ></FlatList>
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
