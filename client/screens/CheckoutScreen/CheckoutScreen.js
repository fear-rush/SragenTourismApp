import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import UseCart from "./UseCart";
import LoadingScreen from "../LoadingScreen";
import CartCard from "../../components/CartCard";
import { LoginContext } from "../../utils/LoginProvider";
import { createUUID } from "../../utils/CommonUtil";
import {
  deleteCart,
  createOrder,
  getAmountAndCart,
  getUser,
} from "../../utils/FirestoreUtil";
import { app } from "../../config/firebase-config";
import { getFirestore, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { separateNumber } from "../../utils/CommonUtil";

const db = getFirestore(app);

export default function CheckoutScreen() {
  const { list, setList, price, cartLoading } = UseCart();
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(LoginContext);
  const [paymentId, setPaymentId] = useState(null);

  console.log(paymentId);

  const checkoutHandler = async () => {
    try {
      // await storeCustomerId(user.uid);
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
    // setList([]);
  };

  async function sendInvoice() {
    const { userData } = await getUser(user.uid);
    const { amount, cart } = await getAmountAndCart(user);

    if (cart != null || cart != undefined || cart != []) {
      fetch("https://sragenapp-server.herokuapp.com/send-invoice", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentNumber: paymentId,
          item: cart,
          username: userData.name,
          address: userData.address,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          qrData: paymentId,
        }),
      });
      console.log(`this is paymentId ${paymentId} `)
      console.log("paymentId", paymentId), console.log("user", user.uid);
      console.log(`this is user information ${JSON.stringify(userData)}`);
      console.log(`this is cart ${cart}`);
      await deleteCart(user.uid);
    } else {
      alert("Items not found");
    }
  }

  console.log(paymentId);

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
            <Text style={styles.modalText}>Total Price: {separateNumber(price)}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
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
          <Text style={styles.total}>Total: Rp. {separateNumber(price)} </Text>
        </View>
        <Pressable
          style={styles.checkoutButton}
          onPress={() => {
            checkoutHandler();
            setModalVisible(true);
          }}
        >
          <Text style={styles.checkoutText}>Check Out</Text>
        </Pressable>
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
  checkoutButton: {
    display: "flex",
    alignSelf:"center",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 220,
    backgroundColor: "#FF6B00",
  },
  checkoutText: {
    color: "#FFF",
    textAlign: "center",
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
  total: {
    fontSize: 16,
    marginTop: 16,
    marginLeft: 14,
    marginBottom: 20 
  }
});
