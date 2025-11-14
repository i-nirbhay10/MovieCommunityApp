import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

export default function SplashScreen({onLoad}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onLoad(); // notify parent that splash finished
    }, 2000); // 2 sec splash

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MovieApp</Text>
      <ActivityIndicator size="large" color="#D4AF37" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B263B',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#D4AF37',
    marginBottom: 20,
  },
});
