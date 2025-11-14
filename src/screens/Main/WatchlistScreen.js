import React, {useEffect} from 'react';
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
import MovieCard from '../../components/MovieCard';
import {store} from '../../app/store';
import Animated, {FadeInDown} from 'react-native-reanimated';

export default function WatchlistScreen({navigation}) {
  const dispatch = useDispatch();
  const list = useSelector(s => s.watchlist.list);

  useEffect(() => {
    dispatch(loadWatchlist());
  }, []);

  const handleRemove = id => {
    Alert.alert('Remove', 'Remove from watchlist?', [
      {text: 'Cancel'},
      {
        text: 'Remove',
        onPress: async () => {
          // Remove movie from Redux state
          dispatch(removeMovie(id));

          // Get updated state from Redux and persist it
          const updatedList = store.getState().watchlist.list; // if using store directly
          await dispatch(persistWatchlist(updatedList));
        },
      },
    ]);
  };

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
        keyExtractor={i => String(i.id)}
        numColumns={2}
        renderItem={({item, index}) => (
          <TouchableOpacity>
            <MovieCard
              movie={item}
              index={index}
              onLongPress={() => handleRemove(item.id)}
              onPress={() =>
                navigation.navigate('MovieDetail', {movieId: item.id})
              }
            />
          </TouchableOpacity>
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },
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
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    alignItems: 'center', // center the 2-column grid
  },
});
