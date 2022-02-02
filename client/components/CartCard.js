import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const CartCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image}/>
      <View>
        <Text>Product: {item.title}</Text>
        <Text>Qty: {item.count}</Text>
        <Text>{item.price}</Text>
      </View>
    </View>
  );
};

export default CartCard;

const styles = StyleSheet.create({
  card: {
    marginTop: 30,
    height: 125,
    borderRadius: 35,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  image: {
    height: 150,
    width: '40%',
  }
})
