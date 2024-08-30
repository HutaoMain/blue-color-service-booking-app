import { useCallback, useEffect, useState } from "react";
import { DocumentInterface } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

export const useFetchAllDocuments = () => {
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);

  const fetchDocuments = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, "documents"));
      const fetchedDocuments: DocumentInterface[] = [];
      querySnapshot.forEach((doc) => {
        fetchedDocuments.push({
          id: doc.id,
          email: doc.data().email,
          certificateUrl: doc.data().certificateUrl,
          certificateFileName: doc.data().certificateFileName,
          licenseUrl: doc.data().licenseUrl,
          licenseFileName: doc.data().licenseFileName,
          validIdUrl: doc.data().validIdUrl,
          validIdFileName: doc.data().validIdFileName,
          createdAt: doc.data().createdAt,
        });
      });
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }, []);

  return { documents, refreshDocuments: fetchDocuments };
};
