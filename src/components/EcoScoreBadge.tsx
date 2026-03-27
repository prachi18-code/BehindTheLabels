import { StyleSheet, Text, View } from 'react-native';

import { colors, ecoScoreColors } from '../theme/colors';
import type { EcoScore } from '../types';

interface EcoScoreBadgeProps {
  score: EcoScore;
}

export const EcoScoreBadge = ({ score }: EcoScoreBadgeProps) => {
  return (
    <View style={[styles.badge, { backgroundColor: ecoScoreColors[score] ?? colors.primary }]}>
      <Text style={styles.title}>Eco Score</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 130,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ECFDF5',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  score: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 40,
    lineHeight: 42,
    fontWeight: '900',
  },
});
