import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const Grid = (props) => {

  const navigation = useNavigation();

  const renderItem = ({ item, index }) => {

    const handlePress = () => {
      navigation.navigate('Product', {
        product: item,
      })
    }

    return (
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View>
          <Text>{item.title}</Text>
          <Text>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        style={styles.grid}
        data={props.products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default Grid;

const styles = StyleSheet.create({
  container: {},
  grid: {
    paddingHorizontal: 30,
  },
  image: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
  },
  card: {
    flex: 1,
    height: 219,
  },
});
