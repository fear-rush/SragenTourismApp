import React, { useEffect, useState, createContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from '../config/firebase-config';

const auth = getAuth(app);

export const LoginContext = createContext({});

export default function LoginProvider(props) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  const authCallback = (user) => {
    setUser(user);
    setIsLoading(false);
  }

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, authCallback);
    return subscribe;
  }, [])

  return (
    <LoginContext.Provider value={{user, isLoading}}>
      {props.children}
    </LoginContext.Provider>
  )
}

