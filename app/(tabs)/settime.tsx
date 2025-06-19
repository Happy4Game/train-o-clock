import { Pressable, StyleSheet, Text, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";

export default function SetTimeScreen() {
  const [clockTime, setClockTime] = useState<string>("");
  function addNumber(number: number) {
    if (clockTime.length + 1 <= 6) setClockTime(clockTime + number.toString());
  }
  function addDoubleZero() {
    if (clockTime.length + 2 <= 6) setClockTime(clockTime + "00");
    else if (clockTime.length + 1 <= 6) setClockTime(clockTime + "0");
  }
  function removeLastNumber() {
    setClockTime(clockTime.slice(0, clockTime.length - 1));
  }
  function beautifulClock(clockTime: string) {
    const hours = clockTime.padStart(6, "0").substring(0, 2);
    const minutes = clockTime.padStart(6, "0").substring(2, 4);
    const sec = clockTime.padStart(6, "0").substring(4, 6);

    return `${hours === "0" || hours === "" ? "00" : hours}h ${
      minutes === "0" || minutes === "" ? "00" : minutes
    }min ${sec === "0" || sec === "" ? "00" : sec}sec`;
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Wake Up</ThemedText>
      </ThemedView>
      <Text style={styles.clockTime}>{beautifulClock(clockTime)}</Text>
      <View style={styles.row}>
        <Pressable
          onPressOut={() => {
            addNumber(1);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>1</Text>
        </Pressable>
        <Pressable
          onPressOut={() => {
            addNumber(2);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>2</Text>
        </Pressable>
        <Pressable
          onPressOut={() => {
            addNumber(3);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>3</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Pressable
          onPressOut={() => {
            addNumber(4);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>4</Text>
        </Pressable>
        <Pressable
          onPressOut={() => {
            addNumber(5);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>5</Text>
        </Pressable>
        <Pressable
          onPressOut={() => {
            addNumber(6);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>6</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Pressable
          onPressOut={() => {
            addNumber(7);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>7</Text>
        </Pressable>
        <Pressable
          onPressOut={() => {
            addNumber(8);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>8</Text>
        </Pressable>
        <Pressable
          onPressOut={() => {
            addNumber(9);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>9</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Pressable onPressOut={() => addDoubleZero()} style={styles.btn}>
          <Text style={styles.btnText}>00</Text>
        </Pressable>
        <Pressable onPressOut={() => addNumber(0)} style={styles.btn}>
          <Text style={styles.btnText}>0</Text>
        </Pressable>
        <Pressable onPressOut={() => removeLastNumber()} style={styles.btn}>
          <Text style={styles.btnText}>👈️</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Pressable onPressOut={() => {}} style={styles.btn}>
          <Text style={styles.btnText}>▶️</Text>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    marginRight: 20,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8,
  },
  row: {
    display: "flex",
    width: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  btn: {
    backgroundColor: "#ffc400",
    width: 70,
    height: 70,
    borderRadius: 200,
  },
  btnText: {
    fontSize: 32,
    margin: "auto",
    alignContent: "center",
    alignItems: "center",
    color: "#841584",
  },
  clockTime: {
    fontSize: 32,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 32,
    color: "white",
  },
});
