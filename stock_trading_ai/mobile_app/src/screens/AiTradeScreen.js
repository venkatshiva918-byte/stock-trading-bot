import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import api from '../api/api';

export default function AiTradeScreen() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAiTrade = async () => {
    if (!symbol || !quantity) {
      Alert.alert('Error', 'Please enter symbol and quantity');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/trade/ai', {
        symbol: symbol.toUpperCase(),
        quantity: parseInt(quantity)
      });
      setResult(response.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      Alert.alert('AI Analysis Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Auto-Trade</Text>
      <Text style={styles.subtitle}>Let the AI decide to Buy or Sell</Text>

      <Text style={styles.label}>Symbol</Text>
      <TextInput
        style={styles.input}
        value={symbol}
        onChangeText={setSymbol}
        placeholder="e.g. TSLA"
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="0"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.analyzeBtn}
        onPress={handleAiTrade}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeText}>ANALYZE & TRADE</Text>}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Result</Text>
          <View style={styles.row}>
            <Text style={styles.key}>Signal:</Text>
            <Text style={[styles.value, result.signal === 'BUY' ? styles.green : result.signal === 'SELL' ? styles.red : styles.gray]}>
              {result.signal}
            </Text>
          </View>
          <Text style={styles.reason}>{result.reason}</Text>
          <View style={styles.divider} />
          <Text style={styles.execution}>Execution: {JSON.stringify(result.execution)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 30 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  analyzeBtn: { backgroundColor: '#9C27B0', padding: 18, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  analyzeText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultBox: { padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  resultTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  key: { fontSize: 16, marginRight: 10 },
  value: { fontSize: 18, fontWeight: 'bold' },
  green: { color: 'green' },
  red: { color: 'red' },
  gray: { color: 'gray' },
  reason: { fontSize: 14, color: '#444', fontStyle: 'italic', marginBottom: 15 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 15 },
  execution: { fontSize: 12, color: '#666' }
});
