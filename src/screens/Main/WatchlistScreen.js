import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  loadWatchlist,
  removeMovie,
  persistWatchlist,
} from '../../features/watchlistSlice';
import MovieCard from '../../components/MovieCard';

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
          dispatch(removeMovie(id));
          const newList = list.filter(i => i.id !== id);
          await dispatch(persistWatchlist(newList));
        },
      },
    ]);
  };

  if (!list.length)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Your watchlist is empty</Text>
      </View>
    );

  return (
    <FlatList
      data={list}
      keyExtractor={i => String(i.id)}
      numColumns={2}
      renderItem={({item, index}) => (
        <TouchableOpacity
          onLongPress={() => handleRemove(item.id)}
          onPress={() =>
            navigation.navigate('MovieDetail', {movieId: item.id})
          }>
          <MovieCard movie={item} index={index} />
        </TouchableOpacity>
      )}
      contentContainerStyle={{padding: 8}}
    />
  );
}
