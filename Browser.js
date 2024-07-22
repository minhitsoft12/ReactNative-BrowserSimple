import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const Browser = ({ navigation }) => {
  const [url, setUrl] = useState('https://www.google.com');
  const webViewRef = useRef(null);

  const goBack = () => webViewRef.current.goBack();
  const goForward = () => webViewRef.current.goForward();
  const reload = () => webViewRef.current.reload();

  const saveToHistory = async (url) => {
    try {
      const savedHistory = await AsyncStorage.getItem('browserHistory');
      let newHistory = savedHistory ? JSON.parse(savedHistory) : [];
      if (!newHistory.includes(url)) {
        newHistory.unshift(url);
        await AsyncStorage.setItem('browserHistory', JSON.stringify(newHistory.slice(0, 100)));
      }
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const onSubmitEditing = () => {
    let newUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      newUrl = 'https://' + url;
    }
    setUrl(newUrl);
    saveToHistory(newUrl);
  };

  const handleDeepLink = ({ url: deepLinkUrl }) => {
    if (deepLinkUrl) {
      setUrl(deepLinkUrl);
      saveToHistory(deepLinkUrl);
    }
  };

  useEffect(() => {
    // Handle deep links when the app is already open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle deep links when the app is opened from a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.addressBar}>
        <TextInput
          style={styles.urlInput}
          value={url}
          onChangeText={setUrl}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webView}
        onNavigationStateChange={(navState) => {
          setUrl(navState.url);
          saveToHistory(navState.url);
        }}

      />
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goForward}>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={reload}>
          <Ionicons name="reload" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Ionicons name="time-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressBar: {
    marginTop: 30,
    height: 40,
    backgroundColor: '#f1f3f4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  urlInput: {
    flex: 1,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  webView: {
    flex: 1,
  },
  toolbar: {
    height: 50,
    backgroundColor: '#f1f3f4',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default Browser;