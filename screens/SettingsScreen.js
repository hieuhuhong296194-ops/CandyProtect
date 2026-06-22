import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext';

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [model, setModel] = useState('chatgpt');
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Cài đặt</Text>
      <View style={styles.row}><Text style={{ color: isDark ? '#fff' : '#000' }}>Chế độ tối</Text><Switch value={isDark} onValueChange={toggleTheme} /></View>
      <View style={styles.row}><Text style={{ color: isDark ? '#fff' : '#000' }}>Model AI mặc định</Text><Text style={{ color: '#6C63FF' }}>{model}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
});
