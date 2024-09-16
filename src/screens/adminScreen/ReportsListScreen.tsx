import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useFetchReports} from '../../utilities/useFetchReports';
import {ReportInterface} from '../../types';
import Navbar from '../../components/Navbar';
import useFetchUserData from '../../utilities/useFetchUserData';
import WorkerRating from '../../components/WorkerRating';

type SortType = 'dateAsc' | 'dateDesc' | 'nameAsc' | 'nameDesc';

const ReportsListScreen = () => {
  const {reports, loading, error, refresh} = useFetchReports();
  const {userData} = useFetchUserData();
  const [sortBy, setSortBy] = useState<SortType>('dateDesc');

  const sortedReports = useMemo(() => {
    if (!reports) return [];
    return [...reports].sort((a, b) => {
      switch (sortBy) {
        case 'dateAsc':
          return (
            new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
          );
        case 'dateDesc':
          return (
            new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
          );
        case 'nameAsc':
          return a.workerEmail.localeCompare(b.workerEmail);
        case 'nameDesc':
          return b.workerEmail.localeCompare(a.workerEmail);
        default:
          return 0;
      }
    });
  }, [reports, sortBy]);

  const renderItem = ({item}: {item: ReportInterface}) => {
    return (
      <View style={styles.reportItem}>
        <Text style={styles.emailText}>Customer: {item.customerEmail}</Text>
        <Text style={styles.emailText}>Worker: {item.workerEmail}</Text>
        <WorkerRating workerEmail={item.workerEmail} />
        <Text style={styles.dateText}>
          Reported At: {new Date(item.reportedAt).toLocaleString()}
        </Text>
      </View>
    );
  };

  const renderSortPicker = () => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={sortBy}
        onValueChange={(itemValue: SortType) => setSortBy(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Date (Newest First)" value="dateDesc" />
        <Picker.Item label="Date (Oldest First)" value="dateAsc" />
        <Picker.Item label="Name (A-Z)" value="nameAsc" />
        <Picker.Item label="Name (Z-A)" value="nameDesc" />
      </Picker>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar
        profileImageUrl={
          userData
            ? userData.imageUrl
            : '../../assets/Profile_avatar_placeholder_large.png'
        }
        title="Report List"
      />
      {renderSortPicker()}
      <FlatList
        data={sortedReports}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  reportItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 2,
  },
  emailText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
  },
});

export default ReportsListScreen;
