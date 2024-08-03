import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import regionData from "../../ph-json/region.json";
import provinceData from "../../ph-json/province.json";
import cityData from "../../ph-json/city.json";
import barangayData from "../../ph-json/barangay.json";
import { HomeStackNavigationProps } from "../typesNavigation";
import { CategoryOptions, categoryOptions } from "../categoryOptions";
import {
  BarangayInterface,
  CityInterface,
  ProvinceInterface,
  RegionInterface,
} from "../types";

export default function FillUpScreen({ route }: HomeStackNavigationProps) {
  const { category } = route.params;

  const options = categoryOptions[category as keyof CategoryOptions] || [];

  const [selectedOption, setSelectedOption] = useState<string>(
    options.length > 0 ? options[0] : ""
  );

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  const [serviceDetails, setServiceDetails] = useState<string>("");

  const [provinces, setProvinces] = useState<ProvinceInterface[]>([]);
  const [cities, setCities] = useState<CityInterface[]>([]);
  const [barangays, setBarangays] = useState<BarangayInterface[]>([]);

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [category]);

  useEffect(() => {
    if (selectedRegion) {
      const filteredProvinces = (provinceData as ProvinceInterface[]).filter(
        (province) => province.region_code === selectedRegion
      );
      setProvinces(filteredProvinces);
      setSelectedProvince(
        filteredProvinces.length > 0 ? filteredProvinces[0].province_code : ""
      );
    } else {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvince) {
      const filteredCities = (cityData as CityInterface[]).filter(
        (city) => city.province_code === selectedProvince
      );
      setCities(filteredCities);
      setSelectedCity(
        filteredCities.length > 0 ? filteredCities[0].city_code : ""
      );
    } else {
      setCities([]);
      setBarangays([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      const filteredBarangays = (barangayData as BarangayInterface[]).filter(
        (barangay) => barangay.city_code === selectedCity
      );
      setBarangays(filteredBarangays);
      setSelectedBarangay(
        filteredBarangays.length > 0 ? filteredBarangays[0].brgy_code : ""
      );
    } else {
      setBarangays([]);
    }
  }, [selectedCity]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{category} Services</Text>
      <Text style={styles.subtitle}>What service do you like?</Text>
      <Picker
        selectedValue={selectedOption}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
      >
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>

      <Text style={styles.label}>Region:</Text>
      <Picker
        selectedValue={selectedRegion}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRegion(itemValue)}
      >
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
            selectedValue={selectedProvince}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedProvince(itemValue)}
          >
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
            selectedValue={selectedCity}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCity(itemValue)}
          >
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
            selectedValue={selectedBarangay}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedBarangay(itemValue)}
          >
            {barangays.map((barangay: BarangayInterface) => (
              <Picker.Item
                key={barangay.brgy_code}
                label={barangay.brgy_name}
                value={barangay.brgy_code}
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

      {/* Add here additional form fields for booking confirmation */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 250,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    marginBottom: 50,
  },
});
