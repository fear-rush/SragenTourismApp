import React, { useState } from "react";
import { Text, Button, View, StyleSheet, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker = ({ date, setDate }) => {
  // const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <>
      <Text>Date: {date.toLocaleDateString("en-US", dateOptions)}</Text>
      <Pressable style={styles.selectDateButton} onPress={showDatePicker}>
        <Text style={styles.selectDateText}>Select Date</Text>
      </Pressable>
      <View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  selectDateButton: {
    display: "flex",
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 140,
    backgroundColor: "#485667",
    marginTop: 10,
    marginBottom: 8
  },
  selectDateText: {
    color: "#FFF",
    textAlign: "center",
  },
});

export default DatePicker;
