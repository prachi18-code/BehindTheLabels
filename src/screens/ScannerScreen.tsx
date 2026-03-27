import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { runOnJS } from 'react-native-reanimated';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { BarcodeFormat, Barcode, scanBarcodes } from 'vision-camera-code-scanner';

import { ScanOverlay } from '../components/ScanOverlay';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types';

const supportedFormats = [BarcodeFormat.EAN_13, BarcodeFormat.UPC_A, BarcodeFormat.CODE_128];

type ScannerNavigation = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;

export const ScannerScreen = () => {
  const navigation = useNavigation<ScannerNavigation>();
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isReady, setIsReady] = useState(false);
  const [scanLocked, setScanLocked] = useState(false);
  const lastScannedValue = useRef<string | null>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const onDetected = useCallback(
    async (codes: Barcode[]) => {
      if (scanLocked) {
        return;
      }

      const rawValue = codes.find((code) => code.rawValue?.trim())?.rawValue?.trim();
      if (!rawValue || rawValue === lastScannedValue.current) {
        return;
      }

      lastScannedValue.current = rawValue;
      setScanLocked(true);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Haptics can fail on unsupported devices without affecting flow.
      }

      navigation.navigate('Result', { barcode: rawValue });
      setTimeout(() => {
        setScanLocked(false);
      }, 1000);
    },
    [navigation, scanLocked],
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      const codes = scanBarcodes(frame, supportedFormats);
      runOnJS(onDetected)(codes as unknown as Barcode[]);
    },
    [onDetected],
  );

  const cameraIsActive = useMemo(
    () => isFocused && hasPermission && !scanLocked,
    [hasPermission, isFocused, scanLocked],
  );

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          EcoScan AI needs camera permission to scan product barcodes.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.helperText}>Initializing camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={cameraIsActive}
        frameProcessor={frameProcessor}
        onInitialized={() => setIsReady(true)}
      />

      <ScanOverlay />

      <View style={styles.headerBox}>
        <Text style={styles.title}>EcoScan AI</Text>
        <Text style={styles.subtitle}>Center barcode in the frame to scan instantly</Text>
      </View>

      <View style={styles.footerBox}>
        <Text style={styles.footerText}>
          Supported: EAN-13, UPC, Code-128
        </Text>
        {!isReady && (
          <View style={styles.loadingPill}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.loadingText}>Preparing scanner...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  permissionTitle: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  permissionText: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 14,
    color: colors.textSecondary,
    fontSize: 15,
  },
  headerBox: {
    marginTop: Platform.OS === 'ios' ? 56 : 36,
    marginHorizontal: 20,
    backgroundColor: 'rgba(249, 250, 251, 0.93)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 6,
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
  },
  footerBox: {
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 34 : 24,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(249, 250, 251, 0.95)',
  },
  footerText: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingPill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  loadingText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
});
