import {useCallback, useEffect, useState} from 'react';
import {doc, getDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../firebaseConfig';
import {UserInterface} from '../types';

export const useFetchWorker = (userId: string) => {
  const [userData, setUserData] = useState<UserInterface | undefined>(
    undefined,
  );

  const fetchData = useCallback(async () => {
    if (!userId) return;

    console.log('worker ID ', userId);

    const userRef = doc(FIREBASE_DB, 'users', userId);

    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          id: userDoc.id,
          email: data.email,
          role: data.role,
          fullName: data.fullName,
          birthDate: data.birthDate,
          gender: data.gender,
          imageUrl: data.imageUrl,
          isWorkerApproved: data.isWorkerApproved,
          contactNumber: data.contactNumber,
          isDeactivated: data.isDeactivated,
          workTitle: data.workTitle,
        });
      } else {
        console.log('No such user!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {userData, refresh: fetchData};
};
