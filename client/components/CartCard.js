import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { separateNumber } from '../utils/CommonUtil';

const CartCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image}/>
      <View>
        <Text style={styles.cardText}>Destination: {item.title}</Text>
        <Text style={styles.cardText}>Ticket Price: Rp. {separateNumber(item.price)}</Text>
        <Text style={styles.cardText}>Total Ticket: {item.count}</Text>
        <Text style={styles.cardText}>Date Reserved: {item.date}</Text>
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
  },
  cardText: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 4,
    marginLeft: 4
  }
})
