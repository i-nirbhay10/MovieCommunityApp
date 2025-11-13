import React, {useEffect} from 'react';
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
import {loadInitialAuth, Auth} from '../features/authSlice';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
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

export default function RootNavigator() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);

  useEffect(() => {
    dispatch(loadInitialAuth());
  }, []);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!user ? (
        <>
          <Stack.Screen name="AuthStack" component={AuthStack} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function AuthStack() {
  const StackA = createStackNavigator();
  return (
    <StackA.Navigator screenOptions={{headerShown: false}}>
      <StackA.Screen name="Login" component={LoginScreen} />
      <StackA.Screen name="Register" component={RegisterScreen} />
    </StackA.Navigator>
  );
}
