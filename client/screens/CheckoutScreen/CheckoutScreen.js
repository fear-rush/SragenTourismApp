import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import UseCart from "./UseCart";
import LoadingScreen from "../LoadingScreen";
import CartCard from "../../components/CartCard";
import { LoginContext } from "../../utils/LoginProvider";
import { createUUID } from "../../utils/CommonUtil";
import {
  storeCustomerId,
  deleteCart,
  createOrder,
  getAmountAndCart,
} from "../../utils/FirestoreUtil";
import { app } from "../../config/firebase-config";
import { getFirestore, onSnapshot, doc, updateDoc } from "firebase/firestore";
import axios from "axios";

const db = getFirestore(app);

export default function CheckoutScreen() {
  const { list, setList, price, cartLoading } = UseCart();
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(LoginContext);
  const [paymentId, setPaymentId] = useState(null);

  console.log(paymentId);

  const checkoutHandler = async () => {
    try {
      await storeCustomerId(user.uid);
      const { amount, cart } = await getAmountAndCart(user);
      await createOrder(cart, paymentId, user.uid, amount);
      // console.log("cart", cart);
    } catch (error) {
      console.log(error);
      alert("error in checkoutUtil", error.message);
    }
  };

  const confirmPaymentHandler = async () => {
    const paymentStatus = doc(db, `order/${paymentId}`);
    await updateDoc(paymentStatus, {
      status: "Success",
    });
    await deleteCart(user.uid);
    // setList([]);
  };

  // let axiosConfig = {
  //   headers: {
  //       'Content-Type': 'application/json;charset=UTF-8',
  //       "Access-Control-Allow-Origin": "*",
  //   }
  // };

  // const sendInvoice = async () => {
  //   const { amount, cart } = await getAmountAndCart(user);
  //   axios
  //     .post(
  //       "http://10.0.0.2:3301/send-invoice",
  //       {
  //         paymentNumber: paymentId,
  //         item: cart,
  //         username: user.uid,
  //       }, axiosConfig
  //     )
  //     .catch((err) => console.log(err));
  // };

  // const sendInvoice = async () => {
  //   let response = () => {
  //     return new Promise(async (resolve, reject) => {
  //       const {amount, cart} = await getAmountAndCart(user);
  //       axios.post('http://localhost:3301/send-invoice', {
  //         paymentNumber: paymentId,
  //         item: cart,
  //         username: user.uid
  //       })
  //     }).then(response => {
  //       resolve(response);
  //     })
  //   }
  // }

  async function sendInvoice() {
    const { amount, cart } = await getAmountAndCart(user);
    console.log("cart", cart);
    console.log("paymentId", paymentId), console.log("user", user.uid);
    fetch("https://sragenapp-server.herokuapp.com/send-invoice", {
      method: "POST",
      mode: "cors",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentNumber: paymentId,
        item: cart,
        username: user.uid,
      }),
    });
  }

  console.log(paymentId);
  // console.log(list);

  useEffect(() => {
    setPaymentId(createUUID());
    try {
      onSnapshot(doc(db, `order/${paymentId}`), (doc) => {
        if (doc.data() != undefined) {
          console.log("current data", doc.data());
          const checkPayment = doc.data();
          if (checkPayment && checkPayment["status"] === "Success") {
            setList([]);
          }
        }
      });
    } catch (error) {
      console.log(error);
      alert("error on subcribe on payment", error.message);
    }
    // return () => {
    //   subscriber;
    // };
  }, [list]);

  const PaymentModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Total Price: {price}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                // setPaymentId(createUUID(12));
                sendInvoice();

                confirmPaymentHandler();
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Confirm Payment</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const ListFooter = () => {
    return (
      <View>
        <View>
          <Text>Total: </Text>
          <Text>{price}</Text>
        </View>
        <Button
          title="CHECK OUT"
          onPress={() => {
            checkoutHandler();
            // console.log(`paymentID: ${paymentId}`);
            setModalVisible(true);
          }}
        />
        <PaymentModal />
      </View>
    );
  };

  if (!cartLoading && list.length <= 0) {
    return null;
  } else if (cartLoading) {
    return <LoadingScreen />;
  } else {
    return (
      <FlatList
        data={list}
        renderItem={CartCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListFooterComponent={ListFooter}
      />
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 100,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F1944F",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
  },
});
