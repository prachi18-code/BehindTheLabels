import { StyleSheet, Text, View } from 'react-native';
import { colors, ecoScoreColors } from '../theme/colors';
import type { EcoScore, ScanResponse } from '../types';

interface ProductAnalysisCardProps {
  product: ScanResponse;
}

const getParameterColor = (label: string | null) => {
  if (!label) return '#9CA3AF'; // Gray for unknown
  if (label.includes('⚠️') || label.includes('high') || label.includes('Ultra')) return '#EF4444'; // Red
  if (label.includes('Moderate') || label.includes('Processed')) return '#F59E0B'; // Yellow
  return '#10B981'; // Green
};

export const ProductAnalysisCard = ({ product }: ProductAnalysisCardProps) => {
  return (
    <View style={styles.cardContainer}>
      {/* 🧠 SMART SUMMARY */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryEmoji}>💡</Text>
        <Text style={styles.summaryText}>{product.smartSummary}</Text>
      </View>

      <Text style={styles.sectionTitle}>Key Insights</Text>

      {/* 1. Eco Score */}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🌱</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Environmental Impact</Text>
          <Text style={[styles.value, { color: ecoScoreColors[product.ecoScore] || colors.primaryDark }]}>
            Score {product.ecoScore}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 2. Carbon Footprint */}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🌍</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Carbon Footprint</Text>
          <Text style={[styles.value, { color: '#059669' }]}>
            {product.carbonFootprint}
          </Text>
          <Text style={styles.subtext}>{product.impact}</Text>
        </View>
      </View>

      {/* 3. Sugar Level */}
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🍭</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Sugar</Text>
          <Text style={[styles.value, { color: getParameterColor(product.sugarLevel) }]}>
            {product.sugarLevel || 'N/A'}
          </Text>
        </View>
      </View>

      {/* 4. Saturated Fat */}
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🧀</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Saturated Fat</Text>
          <Text style={[styles.value, { color: getParameterColor(product.saturatedFatLevel) }]}>
            {product.saturatedFatLevel || 'N/A'}
          </Text>
        </View>
      </View>

      {/* 5. Processing Level (NOVA) */}
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>⚙️</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Processing Level</Text>
          <Text style={[styles.value, { color: getParameterColor(product.novaGroup) }]}>
            {product.novaGroup || 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 4,
    width: '100%',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF', // Light purple
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  summaryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  summaryText: {
    flex: 1,
    color: '#6B21A8',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 20,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtext: {
    marginTop: 2,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
});
