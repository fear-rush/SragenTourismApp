import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Grid from '../components/Grid';
import { UseMounted } from '../hooks/UseMounted';
import { getProducts } from '../utils/FirestoreUtil';
import LoadingScreen from './LoadingScreen';

export default function HomeScreen() {
  const [data, setData] = useState([])
  const isMounted = UseMounted();

  useEffect(() => {
    async function init() {
      const products = await getProducts();
      isMounted && setData(products);
    }
    init();
  }, [])

  if (!data || data.length <= 0) {
    return <LoadingScreen/>
  } else {
    return (
      <View>
        <Grid products={data}/>
      </View>
    )
  }

  // const { user } = useContext(LoginContext);
  // const signOut = () => {
  //   FirebaseUtil.signOut().catch((e) => {
  //     console.log(e);
  //     alert('Something went wrong');
  //   });
  // };
  return (
    <View style={styles.container}>
      {/* <Text> Home: {user?.email} </Text>
      <Button onPress={() => signOut()} title="Logout " /> */}
    </View>
  );
}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignContent: 'center',
//     padding: 20,
//   },
// });
