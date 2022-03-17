import {
  getFirestore,
  collection,
  onSnapshot,
  where,
  getDocs,
  getDoc,
  query,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  increment,
  writeBatch,
} from "firebase/firestore";
import { app } from "../config/firebase-config";
import { getCombinedArray, getPrice, updateOrAdd } from "./CommonUtil";

// var admin = require("firebase-admin");
// var serviceAccount = require("../sragenapp-admin.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const firestore = admin.firestore();

const db = getFirestore(app);

export async function getProducts(ids) {
  try {
    if (ids && ids.length > 0) {
      const productQuery = await query(
        collection(db, "product"),
        where("id", "in", ids)
      );
      const productSnapshot = await getDocs(productQuery);

      return productSnapshot.docs.map((doc) => doc.data());
    } else {
      const productQuery = await query(collection(db, "product"));
      const productSnapshot = await getDocs(productQuery);

      return productSnapshot.docs.map((doc) => doc.data());
    }
  } catch (error) {
    console.log(error);
    alert("error in getProducts", error.message);
  }

  return [];
}

export async function getUser(userUid) {
  try {
    const docRef = doc(db, "customers", userUid);
    const docSnap = await getDoc(docRef);
    // console.log(`this is docsnap ${JSON.stringify(docSnap.data())}`);
    const userData = {
      email: docSnap.data().email,
      address: docSnap.data().address,
      id: docSnap.data().id,
      name: docSnap.data().name,
      phoneNumber: docSnap.data().phone_number,
    }
    return { userData };
  } catch (error) {
    alert("error in getUser", error);
  }
}

export const getCart = async (user) => {
  try {
    const cartCollection = await collection(db, `customers/${user.uid}/cart`);
    const cartRes = await getDocs(cartCollection);
    const cart = cartRes.docs.map((doc) => doc.data());
    return { cart, cartCollection };
  } catch (error) {
    console.log(error);
    alert("error in getCart", error.message);
  }
};

export const addToCart = async (user, productId, date, number) => {
  try {
    if (!user) {
      return;
    }

    const { cart, cartCollection } = await getCart(user);

    if (cart && cart.find((item) => item.id === productId)) {
      const docs = doc(
        db,
        `customers/${user.uid}/cart/${productId.toString()}`
      );
      await updateDoc(docs, { count: number, date: date });
      const path = await doc(
        db,
        `customers/${user.uid}/cart/${productId.toString()}`
      );
    } else {
      setDoc(doc(db, `customers/${user.uid}/cart/${productId.toString()}`), {
        id: productId,
        count: number,
        date: date,
      });
    }
  } catch (error) {
    console.log(error);
    alert("error in addToCart", error.message);
  }
};

export const getCombinedCart = async (user) => {
  const { cart } = await getCart(user);
  const productIds = cart.map((item) => item.id);
  const productArray = await getProducts(productIds);
  return getCombinedArray(cart, productArray);
};

export const subscribeToCartUpdate = (user, updateToCart) => {
  const path = collection(db, `customers/${user.uid}/cart`);
  return onSnapshot(path, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      updateToCart(change);
    });
  });
};

// export const subscribeToPaymentStatus = async (paymentId) => {
//   const paymentStatus = doc(db, `order/${user.uid}`);
//   return onSnapshot(paymentStatus, (snapshot) => {
//     snapshot.docChanges.forEach((change) => {
//       change.doc.data();
//       console.log(change.doc.data())
//     })
//   })
// }

export const getUpdateCart = (old, change, product) => {
  const data = change.doc?.data();
  const newArray = getCombinedArray([data], product);
  return updateOrAdd(old, newArray[0]);
};

export const getCustomerId = async (user) => {
  const customer = doc(db, `customers/${user.uid}`);
  const customerId = getDocs(customer);
  return customerId.data();
};

export const storeCustomerId = async (
  userUid,
  name,
  email,
  phoneNumber,
  address
) => {
  await setDoc(doc(db, `customers/${userUid}`), {
    id: userUid,
    name: name,
    email: email,
    phone_number: phoneNumber,
    address: address,
  });
};

export const deleteCart = async (userUid) => {
  try {
    const batch = writeBatch(db);
    const snapshot = await collection(db, `customers/${userUid}/cart`);
    const snapshotData = await getDocs(snapshot);
    snapshotData.forEach((data) => {
      batch.delete(data.ref);
    });
    await batch.commit();
  } catch (error) {
    alert(error.message);
    console.log(error);
  }
};

export const createOrder = async (cart, paymentId, userUid, amount) => {
  await setDoc(doc(db, `order/${paymentId}`), {
    user_uid: userUid,
    status: `Waiting for confirmation`,
    amount: amount,
    payment_id: paymentId,
  });

  // const orderCart = collection(db, `order/${paymentId}/cart`);
  cart.forEach((product) => {
    setDoc(doc(db, `order/${paymentId}/cart/${product.id.toString()}`), {
      price: product.price,
      count: product.count,
    });
  });
};

export const completeOrder = async (paymentId) => {
  const order = doc(db, `order/${paymentId}`);
  await updateDoc(order, {
    status: "Success",
  });
  const userUid = await await getDocs(order);
  const userUidData = await userUid.data().user_uid;
  await deleteCart(userUidData);
};

export const updatePaymentStatus = async (paymentId) => {
  const paymentStatus = doc(db, `order/${user.uid}`);
  await updateDoc(paymentStatus, {
    status: "Success",
  });
};

export const getAmountAndCart = async (user) => {
  const { cart } = await getCart(user);
  const products = await getProducts(cart.map((data) => data.id));
  const combinedCart = getCombinedArray(cart, products);

  return { amount: getPrice(combinedCart), cart: combinedCart };
};

/*********  WEB V8 **********/

// export const getCustomerId = async (user) => {
//   const customer = await firestore.collection("customers").doc(user.uid).get();
//   return customer.data();
// };

// export const storeCustomerId = async (userUid) => {
//   await firestore.collection("customers").doc(userUid).set({
//     customer_id: customerId,
//   });
// };

// export const deleteCart = async (userUid) => {
//   const snapshot = await firestore
//     .collection("cart")
//     .doc(userUid)
//     .collection("cart")
//     .get();
//   snapshot.docs.forEach((doc) => {
//     doc.ref.delete();
//   });
// };

// export const createOrder = (cart, paymentId, userUid, amount) => {
//   const order = firestore.collection("order").doc(paymentId);
//   order.set({ user_uid: userUid, status: "initiated", amount: amount });

//   const orderCart = order.collection("cart");
//   cart.forEach((product) => {
//     orderCart.doc(product.id.toString()).set({
//       price: product.price,
//       count: product.count,
//     });
//   });
// };

/******** *****************/
