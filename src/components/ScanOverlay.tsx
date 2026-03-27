import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';

export const ScanOverlay = () => {
  return (
    <View pointerEvents="none" style={styles.overlayContainer}>
      <View style={styles.topShade} />

      <View style={styles.middleRow}>
        <View style={styles.sideShade} />
        <View style={styles.scanFrame} />
        <View style={styles.sideShade} />
      </View>

      <View style={styles.bottomShade} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  topShade: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.42)',
  },
  middleRow: {
    height: 230,
    flexDirection: 'row',
  },
  sideShade: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.42)',
  },
  scanFrame: {
    width: 260,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
  bottomShade: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.42)',
  },
});
