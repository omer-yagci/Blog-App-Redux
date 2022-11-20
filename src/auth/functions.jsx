import firebase from "./firebase";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";
import { useState, useEffect } from "react";

// Bilgi Ekleme

export const AddUser = (values, displayName, email, currentDate) => {
  const db = getDatabase(firebase);
  const userRef = ref(db, "users/");
  const newUserRef = push(userRef);
  set(newUserRef, {
    title: values.title,
    image: values.image,
    content: values.content,
    username: displayName,
    userEmail: email,
    currentDate: currentDate,
  });
};

// Bilgi Çağırma

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contactList, setContactList] = useState();
  useEffect(() => {
    const db = getDatabase(firebase);
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const userArray = [];

      for (let id in data) {
        userArray.push({ id, ...data[id] });
      }
      setContactList(userArray);
      setIsLoading(false);
    });
  }, []);
  return { isLoading, contactList };
};

export const DeleteUser = (id) => {
  const db = getDatabase(firebase);
  remove(ref(db, "users/" + id));
  // Toastify("Deleted Successfully");
};

export const UpdateUser = (values) => {
  const db = getDatabase(firebase);
  const updates = {};
  updates["users/" + values.id] = values;

  return update(ref(db), updates);
};
