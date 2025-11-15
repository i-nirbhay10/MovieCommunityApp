import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const ReviewBottomSheet = forwardRef(({onSubmit}, ref) => {
  const sheetRef = useRef(null);
  const [review, setReview] = useState('');

  const snapPoints = useMemo(() => ['40%'], []);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (sheetRef.current) sheetRef.current.expand?.();
    },
    close: () => sheetRef.current?.close(),
  }));

  const handleSubmit = () => {
    if (review.trim()) {
      onSubmit(review);
      setReview('');
      sheetRef.current?.close();
    }
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1} // start closed
      snapPoints={snapPoints}
      enablePanDownToClose>
      <BottomSheetView style={styles.sheetContainer}>
        <View style={styles.header}>
          {/* <View style={styles.dragIndicator} /> */}
          <Text style={styles.title}>Write a Review</Text>
        </View>
        <TextInput
          placeholder="Share your thoughts..."
          multiline
          value={review}
          onChangeText={setReview}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default ReviewBottomSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B263B',
  },
  input: {
    flex: 1,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1B263B',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {color: '#FFF', fontWeight: '700', fontSize: 16},
});
