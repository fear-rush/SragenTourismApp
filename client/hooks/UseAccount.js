import React, { useState } from "react";
import { Alert } from "react-native";
import FirebaseUtil from "../utils/FirebaseUtil";

export default function UseAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInOrUp = async (signIn) => {
    try {
      if (signIn) {
        await FirebaseUtil.signIn(email, password);
      } else {
        await FirebaseUtil.signUp(email, password);
      }
    } catch (error) {
      console.log("Account error: ", error);
      alert("something went wrong");
    }
    setLoading(false);
  };

  return { signInOrUp, email, setEmail, password, setPassword, loading };
}
