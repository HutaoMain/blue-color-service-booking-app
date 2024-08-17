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
          certificate: doc.data().certificate,
          license: doc.data().license,
          validId: doc.data().validId,
          createdAt: doc.data().createdAt,
        });
      });
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, refreshDocuments: fetchDocuments };
};
