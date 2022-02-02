import React, { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Button,
} from "react-native";
import { LoginContext } from "../utils/LoginProvider";
import { addToCart } from "../utils/FirestoreUtil";

const ProductScreen = ({ route, navigation }) => {
  const { user } = useContext(LoginContext);
  const product = route.params.product;

  const handlePress = () => {
    try {
      addToCart(user, product.id);
      // console.log(product.id)
      // console.log(user);
    } catch (error) {
      console.log(error);
      alert(`ProducScreen error: ${error.message}`);
    }
  };

  return (
    <ScrollView>
      <View>
        <Image source={{ uri: product.image }} style={styles.image} />
      </View>
      <View>
        <Text>{product.title}</Text>
        <Text>{product.price}</Text>
        <Button title="ADD TO CART" onPress={handlePress} />
        <Text>{product.description}</Text>
      </View>
    </ScrollView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  image: {
    height: 460,
    resizeMode: "cover",
  },
});
