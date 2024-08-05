import { useState, useEffect } from "react";
import useAuthStore from "../zustand/AuthStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserInterface } from "../types";
import { FIREBASE_DB } from "../firebaseConfig";

const useFetchUserData = () => {
  const [userData, setUserData] = useState<UserInterface>();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("email", "==", user)
      );

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const userData = {
            email: doc.data().email,
            role: doc.data().role,
            fullName: doc.data().fullName,
            age: doc.data().age,
            gender: doc.data().gender,
            imageUrl: doc.data().imageUrl,
          };
          setUserData(userData);
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [user]);

  return userData;
};

export default useFetchUserData;
