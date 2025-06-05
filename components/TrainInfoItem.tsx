import { Button, Text, type ViewProps } from "react-native";

import { convertNativiaDate, Departure } from "@/scripts/utils";

export type TrainInfoItemProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  localDeparture: Departure;
  deleteDeparture: (departure: Departure) => void;
};

export function TrainInfoItem({
  style,
  lightColor,
  darkColor,
  localDeparture,
  deleteDeparture,
  ...otherProps
}: TrainInfoItemProps) {
  return (
    <>
      <Text style={{ color: "white" }}>
        {localDeparture.display_informations.direction}
        {`\nBase departure : ${convertNativiaDate(
          localDeparture.stop_date_time.base_departure_date_time
        )}\nDeparture : ${convertNativiaDate(
          localDeparture.stop_date_time.departure_date_time
        )}`}{" "}
      </Text>
      <Button
        title="X"
        color={"red"}
        onPress={() => deleteDeparture(localDeparture)}
      />
    </>
  );
}
