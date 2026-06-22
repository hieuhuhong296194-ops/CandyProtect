import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useTheme } from '../components/ThemeContext';

const BACKEND_URL = 'http://localhost:3000';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceVisible, setVoiceVisible] = useState(false);
  const webviewRef = useRef(null);
  const { isDark } = useTheme();

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/ai/chat`, { message: text, model: 'chatgpt' });
      const reply = res.data.reply;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      Speech.speak(reply, { language: 'vi-VN' });
    } catch (err) {
      Alert.alert('Lỗi', 'Không kết nối được backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceStart = () => setVoiceVisible(true);

  const onVoiceResult = useCallback((event) => {
    const { data } = event.nativeEvent;
    if (data && data.text) {
      setInput(data.text);
      setVoiceVisible(false);
    }
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.msgBubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.msgText}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList data={messages} renderItem={renderItem} keyExtractor={(_, idx) => idx.toString()} style={styles.msgList} contentContainerStyle={{ padding: 10 }} />
      <View style={styles.inputContainer}>
        <TextInput style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#333' : '#ccc' }]} value={input} onChangeText={setInput} placeholder="Nhập tin nhắn..." placeholderTextColor={isDark ? '#aaa' : '#555'} multiline />
        <TouchableOpacity onPress={handleVoiceStart} style={styles.micButton}><Ionicons name="mic" size={24} color="#6C63FF" /></TouchableOpacity>
        <TouchableOpacity onPress={() => sendMessage()} style={styles.sendButton}><Ionicons name="send" size={24} color="white" /></TouchableOpacity>
      </View>
      {loading && <ActivityIndicator style={{ marginVertical: 5 }} color="#6C63FF" />}
      {voiceVisible && (
        <WebView ref={webviewRef} source={{ html: `<html><body><script>const recognition = new webkitSpeechRecognition(); recognition.lang = 'vi-VN'; recognition.interimResults = false; recognition.maxAlternatives = 1; recognition.start(); recognition.onresult = (event) => { window.ReactNativeWebView.postMessage(JSON.stringify({text: event.results[0][0].transcript})); }; recognition.onerror = (e) => { window.ReactNativeWebView.postMessage(JSON.stringify({error: e.error})); };</script></body></html>` }} onMessage={onVoiceResult} style={{ height: 0, width: 0 }} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  msgList: { flex: 1 },
  msgBubble: { maxWidth: '80%', padding: 10, borderRadius: 10, marginVertical: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#6C63FF' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#E0E0E0' },
  msgText: { fontSize: 16, color: '#fff' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 5 },
  micButton: { padding: 5 },
  sendButton: { backgroundColor: '#6C63FF', borderRadius: 20, padding: 10 },
});
