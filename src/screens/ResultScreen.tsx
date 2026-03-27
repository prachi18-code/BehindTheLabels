import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { EcoScoreBadge } from '../components/EcoScoreBadge';
import { fetchScanResult } from '../services/api';
import { colors } from '../theme/colors';
import type { RootStackParamList, ScanResponse } from '../types';

type ResultNavigation = NativeStackNavigationProp<RootStackParamList, 'Result'>;

const fallbackData: ScanResponse = {
  productName: 'Unknown Product',
  image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80',
  carbonFootprint: 'N/A',
  ecoScore: 'C',
  impact: 'Equivalent to driving 0 km',
  alternatives: [],
};

export const ResultScreen = () => {
  const navigation = useNavigation<ResultNavigation>();
  const route = useRoute();
  const { barcode } = route.params as RootStackParamList['Result'];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchScanResult(barcode);
        if (isMounted) {
          setResult(data);
        }
      } catch {
        if (isMounted) {
          setError('Could not fetch product insights. Please try scanning again.');
          setResult(fallbackData);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [barcode]);

  const product = useMemo(() => result ?? fallbackData, [result]);

  if (loading) {
    return (
      <View style={styles.loaderScreen}>
        <LinearGradient
          colors={['#F0FDF4', '#F8FAFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loaderCard}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderTitle}>Analyzing Product</Text>
          <Text style={styles.loaderSubtitle}>Fetching carbon footprint insights...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#ECFDF5', '#F9FAFB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <Text style={styles.appTitle}>EcoScan AI</Text>
          <Text style={styles.barcodeLabel}>Barcode: {barcode}</Text>
        </LinearGradient>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.card}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
          <Text style={styles.productName}>{product.productName}</Text>
          <View style={styles.metricsRow}>
            <View style={styles.footprintContainer}>
              <Text style={styles.sectionLabel}>Carbon Footprint</Text>
              <Text style={styles.footprint}>{product.carbonFootprint}</Text>
            </View>
            <EcoScoreBadge score={product.ecoScore} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Impact</Text>
          <Text style={styles.impactText}>{product.impact}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Alternatives</Text>
          {product.alternatives.length === 0 ? (
            <Text style={styles.muted}>No alternatives returned by API.</Text>
          ) : (
            product.alternatives.map((item, index) => (
              <View key={`${item}-${index}`} style={styles.alternativeRow}>
                <View style={styles.dot} />
                <Text style={styles.alternativeText}>{item}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('Scanner')}>
          <Text style={styles.primaryButtonText}>Scan Another Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 130,
    gap: 14,
  },
  headerCard: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  appTitle: {
    color: '#065F46',
    fontSize: 22,
    fontWeight: '900',
  },
  barcodeLabel: {
    marginTop: 6,
    color: '#047857',
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  productName: {
    marginTop: 14,
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  metricsRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  footprintContainer: {
    flex: 1,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  footprint: {
    marginTop: 8,
    color: '#166534',
    fontSize: 28,
    fontWeight: '900',
  },
  impactText: {
    marginTop: 8,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 27,
  },
  muted: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 15,
  },
  alternativeRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  alternativeText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  bottomActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  loaderScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  loaderCard: {
    width: '100%',
    borderRadius: 22,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  loaderTitle: {
    marginTop: 14,
    color: '#065F46',
    fontSize: 22,
    fontWeight: '800',
  },
  loaderSubtitle: {
    marginTop: 6,
    color: '#047857',
    fontSize: 14,
    fontWeight: '600',
  },
});
