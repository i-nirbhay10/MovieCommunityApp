import React, {useEffect, useRef, useCallback} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  StyleSheet,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {loadTrending} from '../../features/moviesSlice';
import MovieCard from '../../components/MovieCard';
import Animated, {FadeInDown} from 'react-native-reanimated';

export default function DiscoverScreen({navigation}) {
  const dispatch = useDispatch();
  const {results, page, total_pages} = useSelector(s => s.movies);
  const [refreshing, setRefreshing] = React.useState(false);

  const backPressCount = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (backPressCount.current === 0) {
          backPressCount.current += 1;
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          setTimeout(() => {
            backPressCount.current = 0; // reset after 2 sec
          }, 2000);
          return true; // prevent default back
        }
        return false; // exit app
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove(); // cleanup when screen loses focus
    }, []),
  );

  useEffect(() => {
    dispatch(loadTrending(1));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(loadTrending(1));
    setRefreshing(false);
  };

  const loadMore = () => {
    if (page < total_pages) dispatch(loadTrending(page + 1));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={styles.title}>Trending This Week</Text>
        <View style={styles.underline} />
      </Animated.View>

      {/* Movie Grid */}
      <FlatList
        data={results}
        keyExtractor={i => String(i.id)}
        numColumns={2}
        renderItem={({item, index}) => (
          <MovieCard
            movie={item}
            index={index}
            onPress={() =>
              navigation.navigate('MovieDetail', {movieId: item.id})
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D4AF37"
            colors={['#D4AF37']}
            progressBackgroundColor="#FFFFFF"
          />
        }
        onEndReached={loadMore}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1B263B',
  },
  underline: {
    height: 3,
    width: 60,
    marginTop: 6,
    backgroundColor: '#D4AF37',
    borderRadius: 3,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: 'center', // center the 2-column grid
  },
});
