import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';

import { fontSizes, spacing } from '../utils/sizes';
import { colors } from '../utils/colors';

const minutesToMillis = (min) => Math.round(min * 1000 * 60);
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes = 0.1, isPaused, onProgress, onEnd }) => {
  const interval = useRef(null);
  const [millis, setMillis] = useState(minutesToMillis(minutes));

  const reset = useCallback(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  const countDown = useCallback(() => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);
        onEnd();  // Anropa endast onEnd, inte reset här
        reset();  // Anropa reset omedelbart efter onEnd här inuti Countdown
        return time;
      }
      const timeLeft = Math.round(time - 1000);
      return timeLeft;
    });
  }, [onEnd, reset]);  // Inkludera 'reset' i dependency array

  useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  useEffect(() => {
    const progress = Math.round(millis / minutesToMillis(minutes) * 100) / 100; 
    onProgress(progress);
  }, [millis, minutes, onProgress]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countDown, 1000);
    return () => clearInterval(interval.current);
  }, [isPaused, countDown]);

  return (
    <Text style={styles.text}>
      {formatTime(Math.floor(millis / 1000 / 60) % 60)}:{formatTime(Math.floor(millis / 1000) % 60)}
    </Text>
  );
};


const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  },
});
