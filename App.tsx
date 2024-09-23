import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import RootNavigation from './src/navigations/RootNavigation';
import {PaperProvider} from 'react-native-paper';
import {TabRefreshProvider} from './src/utilities/TabRefresherProvider';

export default function App() {
  return (
    <TabRefreshProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <RootNavigation />
        </SafeAreaView>
      </PaperProvider>
    </TabRefreshProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
