import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {signOut} from 'firebase/auth';
import useFetchUserData from '../../utilities/useFetchUserData';
import useAuthStore from '../../zustand/AuthStore';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebaseConfig';
import HorizontalLine from '../../components/HorizontalLine';
import {bluegreen, yellowLabel} from '../../reusbaleVariables';
import moment from 'moment';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {useFetchWorkerRatings} from '../../utilities/useFetchWorkerRatings';
import {doc, updateDoc} from 'firebase/firestore';
import {cloudinaryUserName} from '../../env';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

export default function ProfileScreen() {
  const {userData: data, refresh} = useFetchUserData();

  const {refreshRatings, averageRating} = useFetchWorkerRatings(
    data?.email || '',
  );

  // Add state for edit mode
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Add state for edited data
  const [editedData, setEditedData] = useState({
    fullName: data?.fullName || '',
    birthDate: data?.birthDate
      ? moment(data?.birthDate.toDate()).format('YYYY-MM-DD')
      : '',
    gender: data?.gender || '',
    contactNumber: data?.contactNumber || '',
  });

  const [imageUrl, setImageUrl] = useState<string>('');

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const clearUser = useAuthStore(state => state.clearUser);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    await refreshRatings();
    setRefreshing(false);
  };

  // Function to handle image upload
  const uploadImage = async (base64Image: string) => {
    try {
      const data = {
        file: base64Image,
        upload_preset: 'upload',
      };

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryUserName}/image/upload`,
        {
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
        },
      );

      const result = await response.json();
      console.log(result.secure_url);
      setImageUrl(result.secure_url);
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  // Function to pick image
  const pickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0].base64) {
        const base64Img = `data:image/jpeg;base64,${response.assets[0].base64}`;
        uploadImage(base64Img); // Call uploadImage directly after picking
      }
    });
  };

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        Alert.alert('Successfully logout!');
        clearUser();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Add function to handle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedData({
        fullName: data?.fullName || '',
        birthDate: data?.birthDate
          ? moment(data?.birthDate.toDate()).format('YYYY-MM-DD')
          : '',
        gender: data?.gender || '',
        contactNumber: data?.contactNumber || '',
      });
    }
  };

  const imageUrlCondition = imageUrl ? imageUrl : data?.imageUrl;

  // Add function to handle save changes
  const handleSaveChanges = async () => {
    try {
      const userRef = doc(FIREBASE_DB, 'users', data?.id || '');

      await updateDoc(userRef, {
        fullName: editedData.fullName,
        birthDate: new Date(editedData.birthDate),
        gender: editedData.gender,
        contactNumber: editedData.contactNumber,
        imageUrl: imageUrlCondition, // Update image URL
      });
      Alert.alert('Profile Updated Successfully');
      setIsEditing(false);
      refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error updating profile');
    }
  };

  const toggleCloseIsEditing = () => {
    setIsEditing(false);
  };

  return (
    <>
      <View style={styles.navbarContainer}>
        <Text style={styles.title}>Profile</Text>
        {/* Add Edit/Save button */}
        <View style={styles.toggleEditBtnContainer}>
          <TouchableOpacity
            onPress={isEditing ? handleSaveChanges : toggleEditMode}>
            <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
          {isEditing && (
            <TouchableOpacity onPress={toggleCloseIsEditing}>
              <Text style={styles.editButton}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          style={{
            flex: 1,
            width: '100%',
            paddingHorizontal: 20,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.coverPhotoContainer}>
            <Image
              source={{uri: imageUrl ? imageUrl : data?.imageUrl}}
              style={styles.imageUrl}
            />
            {isEditing && (
              <TouchableOpacity
                onPress={pickImage}
                style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            )}

            <View style={styles.nameContainer}>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.input,
                    {textAlign: 'center', marginBottom: 15},
                  ]}
                  value={editedData.fullName}
                  onChangeText={text =>
                    setEditedData({...editedData, fullName: text})
                  }
                />
              ) : (
                <Text style={styles.profileName}>{data?.fullName}</Text>
              )}
            </View>
            <Text style={styles.profileEmail}>{data?.email}</Text>
            {data?.role === 'worker' && (
              <StarRatingDisplay
                rating={averageRating || 0}
                enableHalfStar={false}
                starSize={30}
                color="#FFD700"
              />
            )}
          </View>

          <HorizontalLine />

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Basic Info</Text>

            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Birth Date: </Text>
              <Text style={styles.infoValue}>
                {data?.birthDate
                  ? moment(data?.birthDate.toDate())
                      .local()
                      .format('YYYY-MM-DD')
                  : ''}
              </Text>
            </View>

            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Gender: </Text>
              <Text style={[styles.infoValue, {textTransform: 'capitalize'}]}>
                {data?.gender}
              </Text>
            </View>

            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Contact Number: </Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedData.contactNumber}
                  onChangeText={text =>
                    setEditedData({...editedData, contactNumber: text})
                  }
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={[styles.infoValue, {textTransform: 'capitalize'}]}>
                  {data?.contactNumber}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 90,
    backgroundColor: bluegreen,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  coverPhotoContainer: {
    alignItems: 'center',
  },
  profileName: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  imageUrl: {
    width: 150,
    height: 150,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderWidth: 3,
    borderColor: yellowLabel,
  },
  profileEmail: {
    fontSize: 16,
    color: 'gray',
  },
  infoContainer: {
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    color: '#303234',
    paddingBottom: 10,
  },
  infoColumn: {
    flex: 1,
    paddingBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  infoValue: {
    fontSize: 16,
    color: 'black',
  },
  logoutButton: {
    backgroundColor: bluegreen,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    marginBottom: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    color: 'black',
    width: '100%',
  },
  editButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  changePhotoButton: {
    backgroundColor: bluegreen,
    padding: 10,
    width: 150,
    borderRadius: 5,
    marginVertical: 10,
  },
  changePhotoText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  toggleEditBtnContainer: {
    marginRight: 20,
    flexDirection: 'row',
  },
});
