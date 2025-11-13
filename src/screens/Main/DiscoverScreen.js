import React, {useEffect} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loadTrending} from '../../features/moviesSlice';
import MovieCard from '../../components/MovieCard';

export default function DiscoverScreen({navigation}) {
  const dispatch = useDispatch();
  const {results, page, total_pages} = useSelector(s => s.movies);
  const [refreshing, setRefreshing] = React.useState(false);

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
    <View style={{flex: 1}}>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        contentContainerStyle={{padding: 8}}
      />
    </View>
  );
}
