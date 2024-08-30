import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

// Define the interface for the rating documents
interface RatingInterface {
  id: string;
  workerEmail: string;
  rating: number;
  // Add other fields if needed
}

export const useFetchWorkerRatings = (workerEmail: string) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratings, setRatings] = useState<RatingInterface[]>([]);

  const fetchRatings = useCallback(async () => {
    try {
      // Create a query to fetch ratings for a specific worker's email
      const ratingsQuery = query(
        collection(FIREBASE_DB, "ratings"),
        where("workerEmail", "==", workerEmail)
      );

      const querySnapshot = await getDocs(ratingsQuery);
      const fetchedRatings: RatingInterface[] = [];
      let totalRating = 0;

      querySnapshot.forEach((doc) => {
        const ratingData = doc.data() as RatingInterface;
        fetchedRatings.push({
          id: doc.id,
          workerEmail: ratingData.workerEmail,
          rating: ratingData.rating,
          // Add other fields if needed
        });
        totalRating += ratingData.rating;
      });

      setRatings(fetchedRatings);

      if (fetchedRatings.length > 0) {
        setAverageRating(totalRating / fetchedRatings.length);
      } else {
        setAverageRating(null); // No ratings found
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  }, [workerEmail]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  return { ratings, averageRating, refreshRatings: fetchRatings };
};
