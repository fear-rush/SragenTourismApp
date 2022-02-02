import React from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import AppStack from './navigation/AppStack';
import LoginProvider from './utils/LoginProvider';



export default function App() {
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
  return (
    <View style={styles.container}>
      <LoginProvider>
        <AppStack />
      </LoginProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
