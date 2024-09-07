import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useCallback, useState} from 'react';
import {UserInterface} from '../../types';
import WorkerCard from '../../components/WorkerCard';
import {useFetchAllUsers} from '../../utilities/useFetchAllUsers';
import Navbar from '../../components/Navbar';
import useFetchUserData from '../../utilities/useFetchUserData';

export default function WorkerList() {
  const {users, refreshUsers} = useFetchAllUsers();
  const {userData} = useFetchUserData();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const userListFiltered = users.filter(item => item.role === 'worker');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshUsers(); // Assuming refetchUsers is a function that re-fetches the user data
    setRefreshing(false);
  }, [refreshUsers]);

  const renderWorkerCard = ({item}: {item: UserInterface}) => (
    <WorkerCard user={item} />
  );

  return (
    <View style={styles.container}>
      <Navbar
        profileImageUrl={
          userData
            ? userData.imageUrl
            : '../../assets/Profile_avatar_placeholder_large.png'
        }
        title="Applicant List"
      />
      <FlatList
        data={userListFiltered}
        renderItem={renderWorkerCard}
        keyExtractor={item => item.email}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']} // You can customize the loading spinner color
            tintColor="#0000ff" // For iOS
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
