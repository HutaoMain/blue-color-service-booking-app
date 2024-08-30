import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";
import { ReportInterface } from "../types";

export const useFetchReports = () => {
  const [reports, setReports] = useState<ReportInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const reportsCollection = collection(FIREBASE_DB, "reports");
      const querySnapshot = await getDocs(reportsCollection);
      const reportsList: ReportInterface[] = [];

      querySnapshot.forEach((doc) => {
        reportsList.push({
          id: doc.id,
          customerEmail: doc.data().customerEmail,
          workerEmail: doc.data().workerEmail,
          reportedAt: doc.data().reportedAt,
        });
      });

      setReports(reportsList);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { reports, loading, error, refresh: fetchReports };
};
