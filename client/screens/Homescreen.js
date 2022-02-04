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

}
