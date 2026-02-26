import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/api';

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    try {
      setError(null);
      const response = await api.get('/portfolio');
      setPortfolio(response.data);
    } catch (err) {
      setError('Failed to fetch portfolio. Is the backend running?');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPortfolio();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPortfolio();
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.retry} onPress={fetchPortfolio}>Tap to Retry</Text>
      </View>
    );
  }

  if (!portfolio) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Total Value</Text>
        <Text style={styles.value}>${portfolio.portfolio_value.toFixed(2)}</Text>
        <Text style={styles.subLabel}>Cash: ${portfolio.cash.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Positions</Text>
      <FlatList
        data={portfolio.positions}
        keyExtractor={(item) => item.symbol}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text>{item.qty} shares</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.price}>
                  {item.market_value ? `$${item.market_value.toFixed(2)}` : 'N/A'}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No positions</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 20, padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 32, fontWeight: 'bold', marginVertical: 5 },
  subLabel: { fontSize: 14, color: '#888' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8 },
  symbol: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, fontWeight: '600' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  retry: { color: 'blue', textDecorationLine: 'underline' },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' }
});
