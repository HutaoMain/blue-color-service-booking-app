import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from 'react-native';
import {RadioButton, ToggleButton, Tooltip} from 'react-native-paper';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import {addDoc, collection} from 'firebase/firestore';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {HomeStackNavigationProps} from '../../typesNavigation';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebaseConfig';
import {cloudinaryUserName} from '../../env';
import DateTimePicker from '@react-native-community/datetimepicker';
import {bluegreen} from '../../reusbaleVariables';

export default function RegistrationScreen() {
  const customerNavigation =
    useNavigation<HomeStackNavigationProps['navigation']>();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isCustomer, setIsCustomer] = useState<string>('customer');
  const [fullName, setFullName] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('male');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const usersCollectionRef = collection(FIREBASE_DB, 'users');

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const handleConfirm = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the date picker
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  useEffect(() => {
    if (imageBase64) {
      let data = {
        file: imageBase64,
        upload_preset: 'upload',
      };

      fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryUserName}/image/upload`,
        {
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
        },
      )
        .then(async r => {
          let data = await r.json();
          console.log(data.secure_url);
          setImageUrl(data.secure_url);
          return data.secure_url;
        })
        .catch(err => console.log(err));
    }
  }, [imageBase64]);

  const handleRegistration = async () => {
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        Alert.alert('Password do not match');
      }

      if (
        imageUrl === '' ||
        contactNumber === '' ||
        fullName === '' ||
        email === '' ||
        password === '' ||
        birthDate === undefined
      )
        return Alert.alert('Complete the fields to continue the registration!');

      const userCredentials = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password,
      );

      console.log('user credentials', userCredentials);

      const user = userCredentials.user;

      console.log('user: ', user);

      await sendEmailVerification(user);

      await addDoc(usersCollectionRef, {
        email: email,
        fullName: fullName,
        imageUrl: imageUrl,
        gender: selectedGender,
        birthDate: birthDate,
        contactNumber: contactNumber,
        role: isCustomer === 'customer' ? 'customer' : 'worker',
        isWorkerApproved: false,
      });

      Alert.alert('Registration Completed!.');
      setLoading(false);
      setTimeout(() => {
        customerNavigation.navigate('LoginScreen');
      }, 2000);
    } catch (error) {
      let errorMessage = 'An error occurred during registration.';

      if (typeof error === 'object' && error !== null) {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else {
          errorMessage = JSON.stringify(error);
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = String(error);
      }

      Alert.alert('Registration Error', errorMessage);
      setLoading(false);
      console.log(error);
    }
  };

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
        let base64Img = `data:image/jpeg;base64,${response.assets[0].base64}`;
        setImageBase64(base64Img);
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>New user registration</Text>
            <Text style={styles.subtitle}>Tell us about yourself.</Text>
          </View>
          <Image
            source={require('../../../assets/registrationImage.png')}
            style={styles.registrationImage}
          />
        </View>

        <ToggleButton.Row
          onValueChange={setIsCustomer}
          value={isCustomer}
          style={styles.toggleButtonRow}>
          <Tooltip title="Customer">
            <ToggleButton
              style={
                isCustomer === 'customer'
                  ? styles.selectedIsCustomer
                  : styles.toggleButton
              }
              icon="account"
              iconColor={isCustomer === 'customer' ? 'white' : 'black'}
              value="customer"
            />
          </Tooltip>

          <Tooltip title="Worker">
            <ToggleButton
              style={
                isCustomer === 'worker'
                  ? styles.selectedIsCustomer
                  : styles.toggleButton
              }
              icon="briefcase"
              iconColor={isCustomer === 'worker' ? 'white' : 'black'}
              value="worker"
            />
          </Tooltip>
        </ToggleButton.Row>

        <TextInput
          style={styles.input}
          placeholder="Full Name*"
          placeholderTextColor="#888"
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email*"
          placeholderTextColor="#888"
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password*"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password*"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setConfirmPassword}
        />

        <View style={styles.phoneContainer}>
          <View style={styles.phoneCodeContainer}>
            <Text style={styles.phoneCodeText}>+63</Text>
          </View>
          <TextInput
            style={[styles.input, styles.phoneNumberInput]}
            placeholder="Mobile number*"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            onChangeText={setContactNumber}
          />
        </View>

        <Text style={styles.label}>Birth Date:</Text>
        <TouchableOpacity onPress={showPicker} style={styles.input}>
          <Text style={styles.inputText}>
            {birthDate
              ? birthDate.toLocaleDateString()
              : 'Select your birth date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate || new Date()}
            mode="date"
            display="default"
            onChange={handleConfirm}
            maximumDate={new Date()} // Optional: Restrict future dates
          />
        )}
        <Text style={styles.label}>Gender:</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            value="male"
            status={selectedGender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedGender('male')}
          />
          <Text style={styles.radioText}>Male</Text>
          <RadioButton
            value="female"
            status={selectedGender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedGender('female')}
          />
          <Text style={styles.radioText}>Female</Text>
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.selectImage}>
          <Text style={{color: 'black'}}>
            {imageUrl
              ? 'Image picked successfully'
              : 'Pick a Profile Picture from camera roll'}
          </Text>
        </TouchableOpacity>

        <View style={styles.checkboxContainer}>
          {/* <Checkbox style={styles.checkbox} /> */}
          <Text style={styles.checkboxText}>
            By proceeding, I agree to the{' '}
            <Text style={styles.link}>Privacy Notice</Text> and{' '}
            <Text style={styles.link}>Terms & Conditions</Text>.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegistration}>
          <Text style={styles.buttonText}>
            {loading ? 'Please wait...' : 'Signup'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={styles.loginText}
            onPress={() => customerNavigation.navigate('LoginScreen')}>
            Already have an account?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registrationImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  input: {
    color: 'black',
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  phoneCodeContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    marginBottom: 15,
  },
  phoneCodeText: {
    fontSize: 16,
    color: '#000',
  },
  phoneNumberInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: '#888',
  },
  link: {
    color: '#1971E1',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    backgroundColor: '#1971E1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#1971E1',
    fontSize: 14,
    textAlign: 'center',
  },
  label: {
    color: 'black',
    fontSize: 16,
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioText: {
    marginRight: 20,
    color: 'black',
  },
  toggleButtonRow: {
    marginBottom: 20,
    justifyContent: 'center',
    marginHorizontal: 20,
    gap: 10,
  },
  toggleButton: {},
  selectedIsCustomer: {
    backgroundColor: bluegreen,
    borderWidth: 1,
    borderColor: 'black',
  },
  selectImage: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom: 20,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
});
