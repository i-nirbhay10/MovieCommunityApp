import React, {useEffect} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {fetchMovieDetails, posterUrl} from '../../api/tmdb';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import {addMovie, persistWatchlist} from '../../features/watchlistSlice';
import {useSelector} from 'react-redux';

export default function MovieDetailScreen({route, navigation}) {
  const {movieId} = route.params;
  const [movie, setMovie] = React.useState(null);
  const scale = useSharedValue(0.95);
  const dispatch = useDispatch();
  const watchlist = useSelector(s => s.watchlist.list);

  useEffect(() => {
    fetchMovieDetails(movieId).then(setMovie).catch(console.warn);
    scale.value = withTiming(1, {duration: 350});
  }, [movieId]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handleAdd = async () => {
    if (!movie) return;
    dispatch(addMovie(movie));
    const newList = [...watchlist.filter(m => m.id !== movie.id), movie];
    await dispatch(persistWatchlist(newList));
    alert('Added to watchlist');
  };

  if (!movie)
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <ScrollView style={{flex: 1}}>
      <Animated.View style={[{height: 420}, animatedStyle]}>
        <Image
          source={{uri: posterUrl(movie.poster_path, 'w780')}}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 120,
          }}
        />
      </Animated.View>

      <View style={{padding: 16}}>
        <Text style={{fontSize: 22, fontWeight: '700'}}>{movie.title}</Text>
        <Text style={{marginTop: 6}}>
          {movie.release_date} • {String(movie.vote_average)}★
        </Text>
        <Text style={{marginTop: 12}}>{movie.overview}</Text>

        <TouchableOpacity
          onPress={handleAdd}
          style={{
            marginTop: 18,
            backgroundColor: '#1e90ff',
            padding: 12,
            borderRadius: 8,
          }}>
          <Text
            style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>
            Add to Watchlist
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('WriteReview', {movieId})}
          style={{marginTop: 12}}>
          <Text style={{textDecorationLine: 'underline'}}>Write a Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
