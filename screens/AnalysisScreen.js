import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import { useTheme } from '../components/ThemeContext';

export default function AnalysisScreen() {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useTheme();

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/device/stats');
      setStats(res.data);
    } catch (err) {
      setStats({ error: 'Không thể lấy dữ liệu. Kiểm tra backend.' });
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f2f2f2' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Thông tin thiết bị</Text>
      {stats ? (
        <>
          <View style={styles.card}><Text style={styles.cardTitle}>Bộ nhớ</Text><Text>{stats.disk}</Text></View>
          <View style={styles.card}><Text style={styles.cardTitle}>Ứng dụng nghi ngờ</Text>
            {stats.suspiciousApps && stats.suspiciousApps.length > 0 ? stats.suspiciousApps.map((app, i) => <Text key={i}>⚠ {app}</Text>) : <Text>✅ Không có ứng dụng nguy hiểm</Text>}
          </View>
          <FlatList data={stats.packages} keyExtractor={(item) => item} renderItem={({ item }) => <Text style={styles.pkgItem}>{item}</Text>} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />
        </>
      ) : <Text>Đang tải...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  cardTitle: { fontWeight: 'bold', marginBottom: 5 },
  pkgItem: { paddingVertical: 2 },
});
