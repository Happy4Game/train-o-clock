import { StyleSheet, TextInput } from "react-native";

type CustomTextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: Function;
};

export default function CustomTextInput(props: CustomTextInputProps) {
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder={props.placeholder}
        placeholderTextColor={"white"}
        onChangeText={(text) => props.onChangeText(text)}
        value={props.value}
      ></TextInput>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 5,
    borderColor: "grey",
    color: "white",
    padding: 10,
  },
});
