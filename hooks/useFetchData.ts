import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, query, QueryConstraint } from 'firebase/firestore'
import { firestore } from '@/config/firebase'

const useFetchData = <T>(
  collectionName: any,
  constraints : QueryConstraint[] = []
) => {

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) return;
    const collectionRef = collection(firestore, collectionName)
    const q = query(collectionRef, ...constraints)
    
    const unsub = onSnapshot(q, (snapshot /* a object named snapshot being passed*/) => {
      const fethedData = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()// Document fields (a copy of the latest data),
        }
      }) as T[];
      setData(fethedData);
      setLoading(false);
      
    }, (err) => {
      console.log("error fetching ", err);
      setError(err.message);
      setLoading(false);
    });
    return () => unsub(); // ✅ Unsubscribes when component unmounts (how i didnt understood still) // This stops Firestore updates when the component unmounts
  




  }, []);
  return {data , loading , error}
}

export default useFetchData







//Okay, so when we talk about the data variable being of type T[], T represents a generic type. If the user specifies T, the array will hold that specific type.
// It doesn't mean it can hold anything randomly — that's more like "any" type. If T isn’t defined, it could theoretically
// be any type, but it's still a type-safe array of whatever is specified by T.
// Essentially, "T[]" means it’s an array of a flexible type as defined by the user.


//The <T> allows the hook to be reused with any type of data, ensuring type safety.
// For instance, if you fetch an array of User objects, you can specify <User> when using the hook, and data will be typed as User[].


//onSnapshot is used for realtime listening for continously checking for updates on the data source