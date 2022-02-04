import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import FirebaseUtil from "../utils/FirebaseUtil";
import { storeCustomerId } from "../utils/FirestoreUtil";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // sign in or sign up
  const [create, setCreate] = useState(false);

  const signIn = () => {
    FirebaseUtil.signIn(email, password).catch((e) => {
      console.log(e);
      alert("Email/ password is wrong");
    });
  };
  const signUp = () => {
    FirebaseUtil.signUp(email, password)
      .then((registeredUser) => {
        storeCustomerId(registeredUser.user, name, email, phoneNumber, address);
      })
      .catch((e) => {
        console.log(e);
        alert("signUp error", e.message);
      });
  };

  return (
    <View style={styles.container}>
      {create ? (
        <>
          <TextInput
            placeholder="Name"
            onChangeText={setName}
            value={name}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            style={styles.textInput}
            secureTextEntry={true}
          />
          <TextInput
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Address"
            onChangeText={setAddress}
            value={address}
            style={styles.textInput}
          />
          <Button title="Sign Up" onPress={() => signUp()} />
          <Text style={styles.text} onPress={() => setCreate(false)}>
            Already have an account?
          </Text>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            style={styles.textInput}
            secureTextEntry={true}
          />
          <Button title="Sign in" onPress={() => signIn()} />
          <Text style={styles.text} onPress={() => setCreate(true)}>
            Create an Account
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  text: {
    color: "blue",
    marginTop: 20,
  },
});
