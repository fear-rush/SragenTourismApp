import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import DatePicker from "./DatePicker";

const ModalInput = ({
  onTextChange,
  onSubmit,
  visible,
  setVisible,
  value,
  date,
  setDate,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      style={{ justifyContent: "center" }}
      onRequestClose={() => {
        setVisible(!visible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DatePicker date={date} setDate={setDate} />
          <TextInput
            style={styles.ticketForm}
            value={value}
            onChangeText={onTextChange}
            placeholder={"Ticket Amount"}
            keyboardType="numeric"
          />
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Pressable style={styles.confirmButton} onPress={onSubmit}>
              <Text style={styles.confirmText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalInput;

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    width: 220,
    height: 220,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 16,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketForm: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#485667",
    width: 140,
    height: 40,
    marginVertical: 8,
    textAlign: "center",
  },
  confirmButton: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    backgroundColor: "#807474",
  },
  confirmText: {
    color: "#FFF",
    textAlign: "center",
  },
});
