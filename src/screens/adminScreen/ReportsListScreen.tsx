import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useFetchReports} from '../../utilities/useFetchReports';
import {ReportInterface} from '../../types';
import Navbar from '../../components/Navbar';
import useFetchUserData from '../../utilities/useFetchUserData';
import WorkerRating from '../../components/WorkerRating';

const ReportsListScreen = () => {
  const {reports, loading, error, refresh} = useFetchReports();
  const {userData} = useFetchUserData();

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
    <>
      <Navbar
        profileImageUrl={
          userData
            ? userData.imageUrl
            : '../../assets/Profile_avatar_placeholder_large.png'
        }
        title="Report List"
      />
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default ReportsListScreen;
