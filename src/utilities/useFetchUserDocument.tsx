import { useState, useEffect, useCallback } from "react";
import useAuthStore from "../zustand/AuthStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { DocumentInterface } from "../types";
import { FIREBASE_DB } from "../firebaseConfig";

const useFetchUserDocument = () => {
  const [data, setData] = useState<DocumentInterface | undefined>(undefined);
  const user = useAuthStore((state) => state.user);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const q = query(
      collection(FIREBASE_DB, "documents"),
      where("email", "==", "admin@gmail.com")
    );

    try {
      const querySnapshot = await getDocs(q);
      const fetchedData: DocumentInterface[] = [];

      querySnapshot.forEach((doc) => {
        fetchedData.push({
          id: doc.id,
          email: doc.data().email,
          certificate: doc.data().certificate,
          license: doc.data().license,
          validId: doc.data().validId,
          createdAt: doc.data().createdAt,
        });
      });

      if (fetchedData.length > 0) {
        setData(fetchedData[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, refreshDocument: fetchData };
};

export default useFetchUserDocument;
