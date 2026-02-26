import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../api/api';

export default function TradeScreen() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [side, setSide] = useState('buy');
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    if (!symbol || !quantity) {
      Alert.alert('Error', 'Please enter symbol and quantity');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/trade/manual', {
        symbol: symbol.toUpperCase(),
        quantity: parseInt(quantity),
        side: side
      });

      Alert.alert('Success', `Trade Executed: ${side.toUpperCase()} ${quantity} ${symbol}`);
      setSymbol('');
      setQuantity('');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      Alert.alert('Trade Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Trade</Text>

      <Text style={styles.label}>Symbol</Text>
      <TextInput
        style={styles.input}
        value={symbol}
        onChangeText={setSymbol}
        placeholder="e.g. AAPL"
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

      <Text style={styles.label}>Side</Text>
      <View style={styles.row}>
        <TouchableOpacity
            style={[styles.sideBtn, side === 'buy' && styles.buyActive]}
            onPress={() => setSide('buy')}>
          <Text style={[styles.btnText, side === 'buy' && styles.activeText]}>BUY</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.sideBtn, side === 'sell' && styles.sellActive]}
            onPress={() => setSide('sell')}>
          <Text style={[styles.btnText, side === 'sell' && styles.activeText]}>SELL</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.executeBtn}
        onPress={handleTrade}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.executeText}>EXECUTE TRADE</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  row: { flexDirection: 'row', marginBottom: 30 },
  sideBtn: { flex: 1, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginHorizontal: 5 },
  buyActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  sellActive: { backgroundColor: '#F44336', borderColor: '#F44336' },
  btnText: { fontWeight: 'bold', color: '#333' },
  activeText: { color: '#fff' },
  executeBtn: { backgroundColor: '#2196F3', padding: 18, borderRadius: 8, alignItems: 'center' },
  executeText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
