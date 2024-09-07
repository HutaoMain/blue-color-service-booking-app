import {useEffect, useState} from 'react';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {FIREBASE_DB} from '../firebaseConfig';
import {ReportInterface} from '../types';

export const useFetchReportedWorker = (
  workerEmail: string,
  customerEmail: string,
) => {
  const [reports, setReports] = useState<ReportInterface>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log('reports: ', reports);

  const fetchReports = async () => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'reports'),
        where('workerEmail', '==', workerEmail), // Filter by workerEmail
        where('customerEmail', '==', customerEmail), // Filter by customerEmail
      );

      const querySnapshot = await getDocs(q);
      const reportsList: ReportInterface[] = [];

      querySnapshot.forEach(doc => {
        reportsList.push({
          id: doc.id,
          customerEmail: doc.data().customerEmail,
          workerEmail: doc.data().workerEmail,
          reportedAt: doc.data().reportedAt,
        });
      });

      if (reportsList.length > 0) {
        setReports(reportsList[0]);
      } else {
        setReports(undefined); // No matching report found
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [workerEmail, customerEmail]); // Run when either email changes

  return {reports, loading, error, refresh: fetchReports};
};
