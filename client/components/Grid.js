import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const Grid = (props) => {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => {
    const handlePress = () => {
      navigation.navigate("Product", {
        product: item,
      });
    };

    return (
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <ImageBackground source={{ uri: item.image }} style={styles.image}>
          <View style={styles.backgroundTint}>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>{item.location}</Text>
            </View>
          </View>
        </ImageBackground>
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
        numColumns={1}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default Grid;

const styles = StyleSheet.create({
  container: {},
  backgroundTint: {
    backgroundColor: 'rgba(0,0,0, 0.40)',
    width: "100%",
    height: 200,
  },
  content: {
    position: "absolute",
    top: 135,
    left: 12,
  },
  title: {
    fontSize: 22,
    color: "white"
  },
  price: {
    fontSize: 14,
    color: "white"
  },
  grid: {
    paddingHorizontal: 30,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden"
  },
  card: {
    flex: 1,
    height: 219,
  },
});
