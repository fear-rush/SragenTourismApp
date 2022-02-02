import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { UseMounted } from "../../hooks/UseMounted";
import {
  getCombinedCart,
  subscribeToCartUpdate,
  getProducts,
  getUpdateCart,
} from "../../utils/FirestoreUtil";
import { LoginContext } from "../../utils/LoginProvider";
import { getPrice } from "../../utils/CommonUtil";

export default function UseCart() {
  let subscriber;
  const { user } = useContext(LoginContext);
  const [list, setList] = useState([]);
  const [price, setPrice] = useState();
  const [cartLoading, setCartLoading] = useState(false);
  const isMounted = UseMounted();

  const updateToCart = async (change) => {
    const Products = await getProducts([change.doc.data().id]);
    setList((old) => {
      const cart = getUpdateCart(old, change, Products);
      setPrice(getPrice(cart));
      return cart;
    });
  };

  async function getCart() {
    if (!user) {
      return;
    }

    try {
      const cart = await getCombinedCart(user);
      isMounted && setList(cart);

      isMounted && setPrice(getPrice(cart));

      //Real time update on cart firestore database
      subscriber = subscribeToCartUpdate(user, updateToCart);
    } catch (error) {
      console.log(error);
      alert(`UseCart error: ${error.message}`);
    }
  }

  useEffect(() => {
    getCart();

    return () => {
      subscriber && subscriber();
    };
  }, []);
  
  return { list, setList, price, cartLoading };
}
