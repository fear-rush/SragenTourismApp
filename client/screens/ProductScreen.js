import React, { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
  Button,
  ScrollView,
} from "react-native";
import { LoginContext } from "../utils/LoginProvider";
import { addToCart } from "../utils/FirestoreUtil";
import ModalInput from "../components/Modal";
import { separateNumber } from "../utils/CommonUtil";

const ProductScreen = ({ route, navigation }) => {
  const { user } = useContext(LoginContext);
  const [visible, setVisible] = useState(false);
  const [number, onNumberChange] = useState("");
  const [date, setDate] = useState(new Date());

  const product = route.params.product;

  const handlePress = () => {
    setVisible(!visible);
    try {
      addToCart(user, product.id, date.toDateString(), number);
    } catch (error) {
      console.log(error);
      alert(`ProducScreen error: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productContainer}>
        <ImageBackground source={{ uri: product.image }} style={styles.image}>
          <View style={styles.backgroundTint}>
            <View style={styles.productTitle}>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.location}>{product.location}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.descriptionContainer}>
          <View style={styles.description}>
            <Text style={styles.descriptionText}>DESCRIPTION</Text>
            <Text>{product.description}</Text>
            <View style={styles.footer}>
              <View style={styles.priceContent}>
                <Text style={styles.footerText}>PRICE</Text>
                <Text style={styles.price}>Rp.{separateNumber(product.price)}/Person</Text>
              </View>
              <View style={styles.durationContent}>
                <Text style={styles.footerText}>DURATION</Text>
                <Text style={styles.duration}>1 Day</Text>
              </View>
            </View>
            <ModalInput
              visible={visible}
              setVisible={setVisible}
              value={number}
              onTextChange={onNumberChange}
              onSubmit={() => {
                handlePress();
              }}
              date={date}
              setDate={setDate}
            />
            <Pressable
              style={styles.ticketButton}
              onPress={() => {
                setVisible(!visible);
              }}
            >
              <Text style={styles.ticketButtonText}>Buy Ticket</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  backgroundTint: {
    backgroundColor: 'rgba(0,0,0, 0.40)',
    width: "100%",
    height: 400,
  },
  productContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    borderWidth: 2,
  },
  descriptionContainer: {
    height: 450,
    top: -40,
    padding: 1,
  },
  description: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 40,
    padding: 25,
  },
  title: {
    fontSize: 35,
    color: "#FFF",
  },
  location: {
    fontSize: 24,
    color: "#fff",
  },
  productTitle: {
    position: "absolute",
    top: 270,
    left: 10,
  },
  image: {
    height: 400,
    resizeMode: "cover",
    position: "relative",
  },
  footer: {
    marginTop: 30,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  footerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ticketButton: {
    display: "flex",
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 220,
    backgroundColor: "#FF6B00",
    marginTop: 20,
  },
  ticketButtonText: {
    color: "#FFF",
    textAlign: "center",
  },
});
