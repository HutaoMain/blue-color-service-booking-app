import { useState, useEffect, useCallback } from "react";
import useAuthStore from "../zustand/AuthStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserInterface } from "../types";
import { FIREBASE_DB } from "../firebaseConfig";

const useFetchUserData = () => {
  const [userData, setUserData] = useState<UserInterface | undefined>(
    undefined
  );
  const user = useAuthStore((state) => state.user);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const q = query(
      collection(FIREBASE_DB, "users"),
      where("email", "==", user)
    );

    try {
      const querySnapshot = await getDocs(q);
      const fetchedData: UserInterface[] = [];

      querySnapshot.forEach((doc) => {
        fetchedData.push({
          id: doc.id,
          email: doc.data().email,
          role: doc.data().role,
          fullName: doc.data().fullName,
          age: doc.data().age,
          gender: doc.data().gender,
          imageUrl: doc.data().imageUrl,
          isWorkerApproved: doc.data().isWorkerApproved,
        });
      });

      if (fetchedData.length > 0) {
        setUserData(fetchedData[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { userData, refresh: fetchData };
};

export default useFetchUserData;
