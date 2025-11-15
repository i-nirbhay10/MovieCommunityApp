import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {fetchMovieDetails, posterUrl} from '../../api/tmdb';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {addMovie, persistWatchlist} from '../../features/watchlistSlice';
import ReviewBottomSheet from '../../components/ReviewBottomSheet';

export default function MovieDetailScreen({route, navigation}) {
  const {movieId} = route.params;
  const [movie, setMovie] = React.useState(null);
  const scale = useSharedValue(0.95);
  const dispatch = useDispatch();
  const watchlist = useSelector(s => s.watchlist.list);

  const bottomSheetRef = useRef(null);

  const handleOpenReview = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open(); // calls expand()
      console.log('Bottom sheet opened');
    } else {
      console.log('Ref is null!');
    }
  };
  const handleSubmitReview = review => console.log('Review submitted:', review);

  useEffect(() => {
    fetchMovieDetails(movieId).then(setMovie).catch(console.warn);
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Poster + Transition */}
        <Animated.View style={[styles.posterContainer, animatedStyle]}>
          <Image
            source={{uri: posterUrl(movie.poster_path, 'w780')}}
            style={styles.posterImage}
            resizeMode="stretch"
          />
          <LinearGradient
            colors={[
              'rgba(0,0,0,0)',
              'rgba(0,0,0,0.2)',
              'rgba(0,0,0,0.45)',
              'rgba(0,0,0,0.7)',
            ]}
            style={styles.posterGradient}
          />
        </Animated.View>

        {/* Movie Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.goldSeparator} />
          <Text style={styles.metadata}>
            {movie.release_date} • ⭐ {movie.vote_average}
          </Text>
          <Text style={styles.overview}>{movie.overview}</Text>
          {/* Write review */}
          <TouchableOpacity
            onPress={() => handleOpenReview()}
            style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Write a Review</Text>
          </TouchableOpacity>
          {/* Watchlist Button */}
          <TouchableOpacity onPress={handleAdd} style={styles.watchlistButton}>
            <Text style={styles.watchlistButtonText}>Add to Watchlist</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ReviewBottomSheet ref={bottomSheetRef} onSubmit={handleSubmitReview} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    color: '#1B263B',
  },
  posterContainer: {
    height: 420,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },
  contentContainer: {
    padding: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B263B',
  },
  goldSeparator: {
    width: 60,
    height: 4,
    backgroundColor: '#D4AF37',
    marginTop: 8,
    borderRadius: 12,
  },
  metadata: {
    marginTop: 10,
    color: '#2E2E2E',
    fontSize: 15,
    opacity: 0.8,
    fontWeight: '500',
  },
  overview: {
    marginTop: 14,
    lineHeight: 22,
    fontSize: 15,
    color: '#2E2E2E',
    opacity: 0.9,
  },
  watchlistButton: {
    marginTop: 10,
    backgroundColor: '#1B263B',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  watchlistButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  reviewButton: {
    marginTop: 16,
    padding: 4,
  },
  reviewButtonText: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
