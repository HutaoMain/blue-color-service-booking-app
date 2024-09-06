import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import RootNavigation from './src/navigations/RootNavigation';
import {PaperProvider} from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <RootNavigation />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
