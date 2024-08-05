import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { BookingInterface } from "../types";
import { FIREBASE_DB } from "../firebaseConfig";
import useAuthStore from "../zustand/AuthStore";

const useFetchHistoryofBookings = () => {
  const [data, setData] = useState<BookingInterface[]>();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(FIREBASE_DB, "bookings"),
        where("email", "==", user)
      );

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const data = [
            {
              id: doc.id,
              categoryService: doc.data().categoryService,
              specificService: doc.data().specificService,
              region: doc.data().region,
              province: doc.data().province,
              city: doc.data().city,
              barangay: doc.data().barangay,
              additionalDetail: doc.data().additionalDetail,
              status: doc.data().status,
              createdAt: doc.data().createdAt,
            },
          ];
          setData(data);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  return data;
};

export default useFetchHistoryofBookings;
