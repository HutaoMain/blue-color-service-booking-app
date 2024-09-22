import {useState, useCallback, useEffect} from 'react';
import {collection, getDocs, query, orderBy} from 'firebase/firestore';
import {BookingInterface} from '../types';
import {FIREBASE_DB} from '../firebaseConfig';

const useFetchListOfBookings = () => {
  const [data, setData] = useState<BookingInterface[]>([]);

  const fetchData = useCallback(async () => {
    const q = query(
      collection(FIREBASE_DB, 'bookings'),
      orderBy('createdAt', 'desc'),
    );

    try {
      const querySnapshot = await getDocs(q);
      const fetchedData: BookingInterface[] = [];

      querySnapshot.forEach(doc => {
        fetchedData.push({
          id: doc.id,
          customerEmail: doc.data().customerEmail,
          customerId: doc.data().customerId,
          customerName: doc.data().customerName,
          customerProfileImg: doc.data().customerProfileImg,
          categoryService: doc.data().categoryService,
          specificService: doc.data().specificService,
          region: doc.data().region,
          province: doc.data().province,
          city: doc.data().city,
          barangay: doc.data().barangay,
          additionalDetail: doc.data().additionalDetail,
          status: doc.data().status,
          createdAt: doc.data().createdAt,
          ifDoneStatus: doc.data().ifDoneStatus,
          serviceAmountPaid: doc.data().serviceAmountPaid,
          rating: doc.data().rating,
          workerEmail: doc.data().workerEmail,
        });
      });

      if (fetchedData.length > 0) {
        setData(fetchedData);
      }
    } catch (error) {
      console.error('Error fetching bookings data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {ListOfBooking: data, refreshBookings: fetchData};
};

export default useFetchListOfBookings;
