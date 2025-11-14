import React, {useEffect} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {fetchMovieDetails, posterUrl} from '../../api/tmdb';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {addMovie, persistWatchlist} from '../../features/watchlistSlice';

export default function MovieDetailScreen({route, navigation}) {
  const {movieId} = route.params;
  const [movie, setMovie] = React.useState(null);
  const scale = useSharedValue(0.95);
  const dispatch = useDispatch();
  const watchlist = useSelector(s => s.watchlist.list);

  useEffect(() => {
    fetchMovieDetails(movieId).then(setMovie).catch(console.warn);

    // poster zoom animation
    scale.value = withTiming(1, {duration: 400});
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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F9FAFB',
        }}>
        <Text style={{color: '#1B263B'}}>Loading...</Text>
      </View>
    );

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#F9FAFB'}}>
      {/* Poster + Transition */}
      <Animated.View style={[{height: 420}, animatedStyle]}>
        <Image
          source={{uri: posterUrl(movie.poster_path, 'w780')}}
          style={{width: '100%', height: '100%'}}
          resizeMode="stretch"
        />

        {/* Luxury Gradient */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.2)',
            'rgba(0,0,0,0.45)',
            'rgba(0,0,0,0.7)',
          ]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 180,
          }}
        />
      </Animated.View>

      {/* Movie Content */}
      <View style={{padding: 18}}>
        {/* Title */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: '#1B263B',
          }}>
          {movie.title}
        </Text>

        {/* Gold separator */}
        <View
          style={{
            width: 60,
            height: 4,
            backgroundColor: '#D4AF37',
            marginTop: 8,
            borderRadius: 12,
          }}
        />

        {/* Metadata */}
        <Text
          style={{
            marginTop: 10,
            color: '#2E2E2E',
            fontSize: 15,
            opacity: 0.8,
            fontWeight: '500',
          }}>
          {movie.release_date} • ⭐ {movie.vote_average}
        </Text>

        {/* Overview */}
        <Text
          style={{
            marginTop: 14,
            lineHeight: 22,
            fontSize: 15,
            color: '#2E2E2E',
            opacity: 0.9,
          }}>
          {movie.overview}
        </Text>

        {/* Watchlist Button */}
        <TouchableOpacity
          onPress={handleAdd}
          style={{
            marginTop: 22,
            backgroundColor: '#1B263B', // navy
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#D4AF37',
            shadowOpacity: 0.35,
            shadowRadius: 10,
            shadowOffset: {width: 0, height: 4},
            elevation: 4,
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: 16,
            }}>
            Add to Watchlist
          </Text>
        </TouchableOpacity>

        {/* Write review */}
        <TouchableOpacity
          onPress={() => navigation.navigate('WriteReview', {movieId})}
          style={{marginTop: 16, padding: 4}}>
          <Text
            style={{
              color: '#FF6B6B', // coral
              fontWeight: '700',
              fontSize: 15,
              textDecorationLine: 'underline',
            }}>
            Write a Review
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
