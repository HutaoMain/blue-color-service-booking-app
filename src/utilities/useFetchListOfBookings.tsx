import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { BookingInterface } from "../types";
import { FIREBASE_DB } from "../firebaseConfig";

const useFetchListOfBookings = () => {
  const [data, setData] = useState<BookingInterface[]>([]);

  const fetchData = useCallback(async () => {
    const q = query(collection(FIREBASE_DB, "bookings"));

    try {
      const querySnapshot = await getDocs(q);
      const fetchedData: BookingInterface[] = [];

      querySnapshot.forEach((doc) => {
        fetchedData.push({
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
          userName: doc.data().userName,
          userId: doc.data().userId,
        });
      });

      if (fetchedData.length > 0) {
        setData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ListOfBooking: data, refreshBookings: fetchData };
};

export default useFetchListOfBookings;
