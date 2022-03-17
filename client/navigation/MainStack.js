import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import FirebaseUtil from "../utils/FirebaseUtil";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Homescreen";
import CheckoutScreen from "../screens/CheckoutScreen/CheckoutScreen"

const Tabs = createBottomTabNavigator();

export default function MainStack(props) {
  const ProfileScreen = () => {
    return (
      <View>
        {/* <Text>Hi There</Text> */}
        <Button title="SIGN OUT" onPress={FirebaseUtil.signOut} />
      </View>
    );
  };

  const TabIcon = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName = "home-outline";
      if (route.name == "Home") {
        iconName = focused ? "home" : "home-outline";
      } else if (route.name == "Checkout") {
        iconName = focused ? "cart" : "cart-outline";
      } else {
        iconName = focused ? "person" : "person-outline";
      }

      return <Ionicons name={iconName} size={24} color={color} />;
    },
  });

  return (
    <Tabs.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={TabIcon}
      tabBarOptions={{
        activeTintColor: "#FFDB47",
        inactiveTintColor: "black",
        showLabel: false,
      }}
    >
      <Tabs.Screen name="Profile" component={ProfileScreen} />
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
