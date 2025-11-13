import React from 'react';
import {TouchableOpacity, Text, Image, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {posterUrl} from '../api/tmdb';

const {width} = Dimensions.get('window');
const CARD_W = (width - 32) / 2;

export default function MovieCard({movie, index = 0, onPress}) {
  const progress = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withDelay(50 * index, withTiming(1, {duration: 350}));
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {translateY: (1 - progress.value) * 15},
      {scale: 0.98 + progress.value * 0.02},
    ],
  }));

  return (
    <Animated.View style={[{width: CARD_W, margin: 8}, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{borderRadius: 10, overflow: 'hidden'}}>
        <Image
          source={{uri: posterUrl(movie.poster_path)}}
          style={{width: '100%', height: CARD_W * 1.45}}
          resizeMode="cover"
        />
        <Text numberOfLines={1} style={{marginTop: 6, fontWeight: '600'}}>
          {movie.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
