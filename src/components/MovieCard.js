import React from 'react';
import {TouchableOpacity, Text, Image, Dimensions, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {posterUrl} from '../api/tmdb';

const {width} = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_W = (width - CARD_MARGIN * 3) / 2; // perfect 2-column layout

export default function MovieCard({movie, index = 0, onPress}) {
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
    <Animated.View
      style={[
        {
          width: CARD_W,
          margin: CARD_MARGIN / 1.2,
        },
        animatedStyle,
      ]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
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
        }}>
        {/* Poster */}
        <Image
          source={{uri: posterUrl(movie.poster_path)}}
          style={{
            width: '100%',
            height: CARD_W * 1.45,
          }}
          resizeMode="cover"
        />

        {/* Info */}
        <View style={{padding: 12}}>
          {/* Title */}
          <Text
            numberOfLines={1}
            style={{
              fontWeight: '700',
              fontSize: 15,
              color: '#1B263B',
              marginBottom: 6,
            }}>
            {movie.title}
          </Text>

          {/* Rating */}
          {!!movie.vote_average && (
            <View
              style={{
                alignSelf: 'flex-start',
                paddingVertical: 4,
                paddingHorizontal: 8,
                backgroundColor: '#c22ec7ff',
                borderRadius: 6,
              }}>
              <Text
                style={{
                  color: '#f8f8f8ff',
                  fontWeight: '700',
                  fontSize: 12,
                }}>
                ⭐ {movie.vote_average.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
