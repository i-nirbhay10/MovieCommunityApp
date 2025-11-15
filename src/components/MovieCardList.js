import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  View,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {posterUrl} from '../api/tmdb';

const {width} = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_W = (width - CARD_MARGIN * 3) / 2;

export default function MovieCardList({movie, index = 0, onPress}) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(50 * index, withTiming(1, {duration: 350}));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {translateY: (1 - progress.value) * 15},
      {scale: 0.95 + progress.value * 0.05},
    ],
  }));

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={styles.card}>
        <Image
          source={{uri: posterUrl(movie.poster_path)}}
          style={styles.poster}
          resizeMode="stretch"
        />

        <View style={styles.infoBox}>
          <Text numberOfLines={1} style={styles.title}>
            {movie.title}
          </Text>

          {!!movie.vote_average && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                ⭐ {movie.vote_average.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: width,
    padding: CARD_MARGIN,
  },

  card: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},

    // Android shadow
    elevation: 5,
  },

  poster: {
    width: '30%',
    height: 100,
  },

  infoBox: {
    padding: 12,
    flex: 1,
    justifyContent: 'center', // <-- fixes vertical alignment
  },

  title: {
    fontWeight: '700',
    fontSize: 15,
    color: '#1B263B',
    marginBottom: 6,
  },

  ratingContainer: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#c22ec7ff',
    borderRadius: 6,
  },

  ratingText: {
    color: '#f8f8f8ff',
    fontWeight: '700',
    fontSize: 12,
  },
});
