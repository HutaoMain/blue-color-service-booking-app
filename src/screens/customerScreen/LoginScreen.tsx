import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {HomeStackNavigationProps} from '../../typesNavigation';
import useAuthStore from '../../zustand/AuthStore';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebaseConfig';
import {bluegreen, yellowLabel} from '../../reusbaleVariables';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {UserInterface} from '../../types';
import {TextInput} from 'react-native-paper';

export default function LoginScreen() {
  const navigation = useNavigation<HomeStackNavigationProps['navigation']>();

  const setUser = useAuthStore(state => state.setUser);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(true);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [forgotPassLoading, setForgotPassLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password,
      );

      const user = userCredential.user;

      const q = query(
        collection(FIREBASE_DB, 'users'),
        where('email', '==', user.email),
      );
      const querySnapshot = await getDocs(q);
      const fetchedData: UserInterface[] = [];
      querySnapshot.forEach(doc => {
        fetchedData.push({
          id: doc.id,
          email: doc.data().email,
          role: doc.data().role,
          fullName: doc.data().fullName,
          birthDate: doc.data().birthDate,
          contactNumber: doc.data().contactNumber,
          gender: doc.data().gender,
          imageUrl: doc.data().imageUrl,
          isWorkerApproved: doc.data().isWorkerApproved,
          isDeactivated: doc.data().isDeactivated,
        });
      });

      if (!user.emailVerified) {
        Alert.alert(
          'Email not verified',
          'Please verify your email before logging in.',
        );
        setLoginLoading(false);
        return;
      }

      if (fetchedData[0]?.isDeactivated) {
        Alert.alert(
          'Account Deactivated',
          'Your account has been deactivated.',
        );
        setLoginLoading(false);
        return;
      }

      setUser(email);
      setLoginLoading(false);
    } catch (error) {
      setLoginLoading(false);
      Alert.alert('Email or password is incorrect!');
      console.log(error);
    }
  };

  const handleForgotPassword = async () => {
    setForgotPassLoading(true);

    if (email === '') {
      return Alert.alert(
        'Please put your email in the email text box. The system will send an email to your email.',
      );
    }

    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert('Please check your email to reset your password.');
      setForgotPassLoading(false);
    } catch (error) {
      setForgotPassLoading(false);
      Alert.alert('Not able to reset your password.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>EC-AYOS</Text>
          <Text style={styles.subtitle}>Maintenance and Services</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={passwordVisible}
            onChangeText={setPassword}
            right={
              <TextInput.Icon
                icon={!passwordVisible ? 'eye' : 'eye-off'}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>
              {loginLoading ? 'Please wait..' : 'Login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>
              {forgotPassLoading ? 'Please wait' : 'Forgot password?'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={styles.signUpText}
              onPress={() => navigation.navigate('RegisterScreen')}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: bluegreen,
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  textContainer: {
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: yellowLabel,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 36,
    color: '#ffff',
  },
  highlight: {
    color: 'red',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 15,
    color: '#000',
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#1971E1',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  forgotPassword: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  signUpText: {
    fontSize: 16,
    color: '#fff',
  },
});
