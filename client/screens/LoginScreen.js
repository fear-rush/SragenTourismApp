import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Pressable,
} from "react-native";
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
        console.log(
          `User ${registeredUser.user.uid} + ${name} + ${email} + ${phoneNumber} + ${address} `
        );
        storeCustomerId(
          registeredUser.user.uid,
          name,
          email,
          phoneNumber,
          address
        );
      })
      .catch((e) => {
        console.log(e);
        alert("signUp error", e.message);
      });
  };

  return (
    <View style={styles.container}>
      {create ? (
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1542662565-7e4b66bae529?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
          }}
          resizeMode="cover"
          style={styles.image}
        >
          <TextInput
            placeholder="Name"
            onChangeText={setName}
            value={name}
            style={styles.textInput}
            placeholderTextColor={"#fff"}
          />
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            style={styles.textInput}
            placeholderTextColor={"#fff"}
          />
          <TextInput
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            style={styles.textInput}
            secureTextEntry={true}
            placeholderTextColor={"#fff"}
          />
          <TextInput
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            style={styles.textInput}
            placeholderTextColor={"#fff"}
          />
          <TextInput
            placeholder="Address"
            onChangeText={setAddress}
            value={address}
            style={styles.textInput}
            placeholderTextColor={"#fff"}
          />
          <Pressable
            style={styles.button}
            onPress={() => {
              signIn();
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
          <Text style={styles.text} onPress={() => setCreate(false)}>
            Already have an account?
          </Text>
        </ImageBackground>
      ) : (
        <>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1542662565-7e4b66bae529?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
            }}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.tagline}>
              <Text style={styles.big}>Dream It, Visit It</Text>
              <Text style={styles.small}>Discover the magical of Sragen with us</Text>
            </View>
            <TextInput
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              style={styles.textInput}
              placeholderTextColor={"#fff"}
            />
            <TextInput
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              style={styles.textInput}
              secureTextEntry={true}
              placeholderTextColor={"#fff"}
            />
            <Pressable
              style={styles.button}
              onPress={() => {
                signIn();
              }}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
            <Text style={styles.text} onPress={() => setCreate(true)}>
              Create an Account
            </Text>
          </ImageBackground>
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
  },
  tagline: {
    marginBottom: 40,
    marginLeft: 20,
  },
  big: {
    color: "#fff",
    fontSize: 38,
  },
  small: {
    color: "#fff",
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    width: 350,
    alignSelf: "center",
    borderColor: "#fff",
    color: "#fff",
  },
  text: {
    color: "#ddd",
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    display: "flex",
    alignSelf: "center",
    borderRadius: 20,
    elevation: 2,
    width: 140,
    backgroundColor: "#E3B9B9",
    marginTop: 10,
    marginBottom: 8,
    padding: 10,
  },
  buttonText: {
    color: "#000",
    textAlign: "center",
  },
});
