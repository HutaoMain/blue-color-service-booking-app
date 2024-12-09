import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import regionData from '../../../ph-json/region.json';
import provinceData from '../../../ph-json/province.json';
import cityData from '../../../ph-json/city.json';
import barangayData from '../../../ph-json/barangay.json';
import {addDoc, collection, Timestamp} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {categoryOptions, CategoryOptions} from '../../categoryOptions';
import {HomeStackNavigationProps} from '../../typesNavigation';
import {
  BarangayInterface,
  CityInterface,
  ProvinceInterface,
  RegionInterface,
} from '../../types';
import {FIREBASE_DB} from '../../firebaseConfig';
import useFetchUserData from '../../utilities/useFetchUserData';
import useFetchListOfBookingsWithFilter from '../../utilities/useFetchListOfBookingsWithFilter';

export default function FillUpScreen({route}: HomeStackNavigationProps) {
  const {category} = route.params;

  const navigation = useNavigation<HomeStackNavigationProps['navigation']>();

  const {userData} = useFetchUserData();

  const {ListOfBooking} = useFetchListOfBookingsWithFilter({
    filterField: 'customerEmail',
    filterValue: userData?.email || '',
  });

  console.log('ListOfBooking: ', ListOfBooking);

  const options = categoryOptions[category as keyof CategoryOptions] || [];

  const [selectedOption, setSelectedOption] = useState<string>(
    options.length > 0 ? options[0] : '',
  );

  const [selectedRegion, setSelectedRegion] = useState<{
    code: string;
    name: string;
  }>({code: '13', name: 'National Capital Region (NCR)'});
  const [selectedProvince, setSelectedProvince] = useState<{
    code: string;
    name: string;
  }>({code: '', name: ''});
  const [selectedCity, setSelectedCity] = useState<{
    code: string;
    name: string;
  }>({code: '', name: ''});
  const [selectedBarangay, setSelectedBarangay] = useState<{
    code: string;
    name: string;
  }>({code: '', name: ''});

  const [serviceDetails, setServiceDetails] = useState<string>('');

  const [provinces, setProvinces] = useState<ProvinceInterface[]>([]);
  const [cities, setCities] = useState<CityInterface[]>([]);
  const [barangays, setBarangays] = useState<BarangayInterface[]>([]);

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [category]);

  useEffect(() => {
    if (selectedRegion.code) {
      const filteredProvinces = (provinceData as ProvinceInterface[]).filter(
        province => province.region_code === selectedRegion.code,
      );
      setProvinces(filteredProvinces);
      setSelectedProvince(
        filteredProvinces.length > 0
          ? {
              code: filteredProvinces[0].province_code,
              name: filteredProvinces[0].province_name,
            }
          : {code: '', name: ''},
      );
    } else {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
    }
  }, [selectedRegion.code]);

  useEffect(() => {
    if (selectedProvince.code) {
      const filteredCities = (cityData as CityInterface[]).filter(
        city => city.province_code === selectedProvince.code,
      );
      setCities(filteredCities);
      setSelectedCity(
        filteredCities.length > 0
          ? {
              code: filteredCities[0].city_code,
              name: filteredCities[0].city_name,
            }
          : {code: '', name: ''},
      );
    } else {
      setCities([]);
      setBarangays([]);
    }
  }, [selectedProvince.code]);

  useEffect(() => {
    if (selectedCity.code) {
      const filteredBarangays = (barangayData as BarangayInterface[]).filter(
        barangay => barangay.city_code === selectedCity.code,
      );
      setBarangays(filteredBarangays);
      setSelectedBarangay(
        filteredBarangays.length > 0
          ? {
              code: filteredBarangays[0].brgy_code,
              name: filteredBarangays[0].brgy_name,
            }
          : {code: '', name: ''},
      );
    } else {
      setBarangays([]);
    }
  }, [selectedCity.code]);

  const handleSubmit = async () => {
    const bookingData = {
      customerId: userData?.id,
      customerEmail: userData?.email,
      customerName: userData?.fullName,
      customerProfileImg: userData?.imageUrl,
      barangay: selectedBarangay,
      city: selectedCity,
      province: selectedProvince,
      region: selectedRegion,
      categoryService: category,
      specificService: selectedOption,
      additionalDetail: serviceDetails,
      status: 'pending',
      createdAt: Timestamp.fromDate(new Date()),
    };

    try {
      const numberOfBookingByUser = ListOfBooking.filter(
        item => item.status === 'pending',
      );

      console.log('numberOfBookingByUser', numberOfBookingByUser);

      if (numberOfBookingByUser.length >= 3) {
        return Alert.alert('You already have 3 pending bookings.');
      }

      await addDoc(collection(FIREBASE_DB, 'bookings'), bookingData);
      Alert.alert('Booking submitted successfully!');

      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error submitting booking: ', error);
      Alert.alert('Failed to submit booking. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{category} Services</Text>
      <Text style={styles.subtitle}>What service do you like?</Text>
      <Picker
        selectedValue={selectedOption}
        style={styles.picker}
        onValueChange={itemValue => setSelectedOption(itemValue)}>
        {options.map(option => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>

      <Text style={styles.label}>Region:</Text>
      <Picker
        selectedValue={selectedRegion.code}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => {
          const selectedRegionName = regionData[itemIndex].region_name;
          setSelectedRegion({code: itemValue, name: selectedRegionName});
        }}>
        {regionData.map((region: RegionInterface) => (
          <Picker.Item
            key={region.region_code}
            label={region.region_name}
            value={region.region_code}
          />
        ))}
      </Picker>

      {provinces.length > 0 && (
        <>
          <Text style={styles.label}>Province:</Text>
          <Picker
            selectedValue={selectedProvince.code}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              const selectedProvinceName = provinces[itemIndex].province_name;
              setSelectedProvince({
                code: itemValue,
                name: selectedProvinceName,
              });
            }}>
            {provinces.map((province: ProvinceInterface) => (
              <Picker.Item
                key={province.province_code}
                label={province.province_name}
                value={province.province_code}
              />
            ))}
          </Picker>
        </>
      )}

      {cities.length > 0 && (
        <>
          <Text style={styles.label}>City:</Text>
          <Picker
            selectedValue={selectedCity.code}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              const selectedCityName = cities[itemIndex].city_name;
              setSelectedCity({code: itemValue, name: selectedCityName});
            }}>
            {cities.map((city: CityInterface) => (
              <Picker.Item
                key={city.city_code}
                label={city.city_name}
                value={city.city_code}
              />
            ))}
          </Picker>
        </>
      )}

      {barangays.length > 0 && (
        <>
          <Text style={styles.label}>Barangay:</Text>
          <Picker
            selectedValue={selectedBarangay.code}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              const selectedBarangay = barangays[itemIndex].brgy_name;
              setSelectedBarangay({code: itemValue, name: selectedBarangay});
            }}>
            {barangays.map((barangay: BarangayInterface) => (
              <Picker.Item
                key={barangay.brgy_code}
                label={barangay.brgy_name}
                value={barangay.brgy_name}
              />
            ))}
          </Picker>
        </>
      )}

      <Text style={styles.label}>Service Details:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={serviceDetails}
        onChangeText={setServiceDetails}
        placeholder="Provide additional details about the service"
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('ReminderScreen', {
            handleSubmit,
            message:
              "Reminder: Please double check your availability for today's visit before confirming your booking. Customer is liable to pay for the service charge upon cancellation. Thank you!",
          })
        }>
        <Text style={{color: 'white'}}>Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    color: 'black',
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    color: 'black',
    height: 50,
    width: 250,
    marginBottom: 20,
  },
  label: {
    color: 'black',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    color: 'black',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: '#4CAF50',
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 50,
  },
});
