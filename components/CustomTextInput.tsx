import { StyleSheet, TextInput } from "react-native";

type CustomTextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: Function;
  editable: boolean;
};

export default function CustomTextInput(props: Readonly<CustomTextInputProps>) {
  return (
    <TextInput
      style={styles.input}
      placeholder={props.placeholder}
      placeholderTextColor={"white"}
      onChangeText={(text) => props.onChangeText(text)}
      value={props.value}
      editable={props.editable ?? true}
    ></TextInput>
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
