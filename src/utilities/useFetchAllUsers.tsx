import {useCallback, useEffect, useState} from 'react';
import {UserInterface} from '../types';
import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../firebaseConfig';

export const useFetchAllUsers = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'users'));
      const fetchedUsers: UserInterface[] = [];
      querySnapshot.forEach(doc => {
        fetchedUsers.push({
          id: doc.id,
          email: doc.data().email,
          fullName: doc.data().fullName,
          birthDate: doc.data().birthDate,
          gender: doc.data().gender,
          imageUrl: doc.data().imageUrl,
          role: doc.data().role,
          isWorkerApproved: doc.data().isWorkerApproved,
          contactNumber: doc.data().contactNumber,
          isDeactivated: doc.data().isDeactivated,
          workTitle: doc.data().workTitle,
        });
      });
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {users, refreshUsers: fetchUsers};
};
