import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  loadWatchlist,
  removeMovie,
  persistWatchlist,
} from '../../features/watchlistSlice';
import {store} from '../../app/store';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, {FadeInDown} from 'react-native-reanimated';
import MovieCardList from '../../components/MovieCardList';

export default function WatchlistScreen({navigation}) {
  const dispatch = useDispatch();
  const list = useSelector(state => state.watchlist.list);

  useEffect(() => {
    dispatch(loadWatchlist());
  }, [dispatch]);

  const handleRemove = id => {
    Alert.alert('Remove', 'Remove from watchlist?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        onPress: async () => {
          dispatch(removeMovie(id));
          const updatedList = store.getState().watchlist.list;
          await dispatch(persistWatchlist(updatedList));
        },
      },
    ]);
  };

  const renderRightActions = onPress => (
    <View style={styles.deleteContainer}>
      <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (!list.length)
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your watchlist is empty</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={styles.title}>Watchlist</Text>
        <View style={styles.underline} />
      </Animated.View>

      {/* Movie Grid */}
      <FlatList
        data={list}
        keyExtractor={item => String(item.id)}
        // numColumns={2}
        renderItem={({item, index}) => (
          <Swipeable
            overshootRight={false}
            renderRightActions={() =>
              renderRightActions(() => handleRemove(item.id))
            }>
            <TouchableOpacity>
              <MovieCardList
                movie={item}
                index={index}
                onPress={() =>
                  navigation.navigate('MovieDetail', {movieId: item.id})
                }
              />
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },

  /* Header */
  header: {
    paddingVertical: 10,
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

  /* Swipe Delete */
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 80,
    height: '92%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  deleteText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
