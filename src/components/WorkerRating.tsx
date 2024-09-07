import {View, Text} from 'react-native';
import React from 'react';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {useFetchWorkerRatings} from '../utilities/useFetchWorkerRatings';

export default function WorkerRating({workerEmail}: {workerEmail: string}) {
  const {averageRating} = useFetchWorkerRatings(workerEmail);

  console.log(averageRating);

  return (
    <View>
      <Text>Current Worker Rating:</Text>
      <StarRatingDisplay
        rating={averageRating || 0}
        enableHalfStar={false}
        starSize={30}
        color="#FFD700"
      />
    </View>
  );
}
