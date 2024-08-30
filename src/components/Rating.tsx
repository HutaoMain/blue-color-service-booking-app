import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import React, { useState } from "react";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

interface RatingInterface {
  bookingId: string;
  customerEmail: string;
  workerEmail: string;
  onClose: () => void;
}

export default function Rating({
  bookingId,
  customerEmail,
  workerEmail,
  onClose,
}: RatingInterface) {
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRating = async (newRating: number) => {
    setLoading(true);
    setRating(newRating);

    try {
      const bookingRef = doc(FIREBASE_DB, "bookings", bookingId);
      await updateDoc(bookingRef, { rating: newRating });

      const ratingsRef = collection(FIREBASE_DB, "ratings");
      await addDoc(ratingsRef, {
        bookingId: bookingId,
        customerEmail: customerEmail,
        workerEmail: workerEmail,
        rating: newRating,
        timestamp: new Date(),
      });

      console.log(
        "Rating successfully updated and added to the ratings collection."
      );
    } catch (error) {
      console.error("Error updating rating:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Rate the Service</Text>
        <StarRating
          rating={rating}
          onChange={handleRating}
          enableHalfStar={false}
          starSize={30}
          color="#FFD700" // Gold color for the stars
        />
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
