import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DiscoverScreen from '../screens/Main/DiscoverScreen';
import MovieDetailScreen from '../screens/Main/MovieDetailScreen';
import WatchlistScreen from '../screens/Main/WatchlistScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import LoginScreen from '../screens/Auth/LoginScreen';
import {loadInitialAuth} from '../features/authSlice';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

// --- SplashScreen Component ---
function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>Movie community</Text>
      <ActivityIndicator size="small" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

// --- Main Tabs ---
function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {height: 50},
        tabBarIcon: ({color, size}) => {
          let name = 'home';
          if (route.name === 'Discover') name = 'film';
          if (route.name === 'Watchlist') name = 'bookmark';
          if (route.name === 'Profile') name = 'person';
          return <Icon name={name} size={size} color={color} />;
        },
      })}>
      <Tabs.Screen name="Discover" component={DiscoverScreen} />
      <Tabs.Screen name="Watchlist" component={WatchlistScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

// --- Auth Stack ---
function AuthStack() {
  const StackA = createStackNavigator();
  return (
    <StackA.Navigator screenOptions={{headerShown: false}}>
      <StackA.Screen name="Login" component={LoginScreen} />
      <StackA.Screen name="Register" component={RegisterScreen} />
    </StackA.Navigator>
  );
}

// --- Root Navigator ---
export default function RootNavigator() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);
  const [loading, setLoading] = useState(true); // track splash

  useEffect(() => {
    // load auth, then hide splash
    dispatch(loadInitialAuth()).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SplashScreen />; // show splash while loading
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!user ? (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
