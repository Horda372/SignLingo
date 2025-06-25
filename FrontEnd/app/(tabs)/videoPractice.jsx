import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { lightModeColors } from '@/constants/themeColors';

const API_BASE_URL = 'http://192.168.170.235:5000';

export default function TabTwoScreen() {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, setAudioPermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
  const [allPermissionsGranted, setAllPermissionsGranted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraType, setCameraType] = useState('front');

  useEffect(() => {
    requestAllPermissions();
  }, []);

  const requestAllPermissions = async () => {
    try {
      // Request Camera Permission
      let cameraStatus = cameraPermission;
      if (!cameraPermission?.granted) {
        cameraStatus = await requestCameraPermission();
      }

      // Request Audio Permission
      const audioStatus = await Audio.requestPermissionsAsync();
      setAudioPermission(audioStatus);

      // Request Media Library Permission
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus);

      // Check if all permissions are granted
      const allGranted = 
        cameraStatus?.granted && 
        audioStatus?.granted && 
        mediaLibraryStatus?.granted;

      setAllPermissionsGranted(allGranted);

      if (!allGranted) {
        const missingPermissions = [];
        if (!cameraStatus?.granted) missingPermissions.push('Camera');
        if (!audioStatus?.granted) missingPermissions.push('Microphone');
        if (!mediaLibraryStatus?.granted) missingPermissions.push('Media Library');
        
        setError(`Missing permissions: ${missingPermissions.join(', ')}`);
      }

    } catch (err) {
      console.error('Permission request error:', err);
      setError('Failed to request permissions');
    }
  };

 const startRecording = async () => {
  if (!allPermissionsGranted) {
    Alert.alert('Permissions Required', 'All permissions must be granted to record videos.');
    return;
  }

  if (!cameraRef.current || recording || processing) return;

  setRecording(true);
  setResult(null);
  setError(null);

  try {
    const video = await cameraRef.current.recordAsync({
      maxDuration: 10,
      mute: false,
      quality: '720p',
    });

    setRecording(false);

    // Wait for the file to be fully available before proceeding
    await new Promise(res => setTimeout(res, 500));

    if (mediaLibraryPermission?.granted) {
      await MediaLibrary.saveToLibraryAsync(video.uri);
    }

    await processVideo(video);

  } catch (err) {
    console.error('Recording error:', err);
    setError(`Recording failed: ${err.message || 'Unknown error'}`);
    setRecording(false);
  }
};


 const stopRecording = async () => {
  if (recording && cameraRef.current) {
    try {
      await cameraRef.current.stopRecording();
      setRecording(false);  // Ensure this is reset
      await new Promise(resolve => setTimeout(resolve, 500)); // Let camera recover
    } catch (err) {
      console.error('Stop recording error:', err);
      setError(`Failed to stop recording: ${err.message}`);
    }
  }
};

const processVideo = async (videoData) => {
  if (!videoData?.uri) {
    setError('No video data received');
    return;
  }

  setProcessing(true);

  try {
    const formData = new FormData();
    formData.append('file', {
      uri: videoData.uri,
      type: 'video/mp4',
      name: 'recorded_video.mp4',
    });

    const response = await fetch(`${API_BASE_URL}/predict_video`, {
      method: 'POST',
      body: formData,
      // ← remove headers: let fetch set Content-Type and boundary
    });
    console.log('fetch response:', response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('server JSON:', data);

    if (data.prediction && data.prediction !== 'No hand detected') {
      setResult({
        label: data.prediction,
        description: `Detected sign: ${data.prediction}`,
      });
    } else {
      setResult({
        label: 'No Sign Detected',
        description: 'No hand or recognizable sign was detected in the video.',
      });
    }
  } catch (err) {
    console.error('API Error:', err);
    setError(`Processing failed: ${err.message || 'Unable to connect to server'}`);
  } finally {
    setProcessing(false);
  }
};



  const flipCamera = () => setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  const clearError = () => setError(null);
  const clearResult = () => setResult(null);

  // Show loading while checking permissions
  if (cameraPermission === null || audioPermission === null || mediaLibraryPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={lightModeColors.auth.text} />
        <Text style={styles.statusText}>Checking permissions...</Text>
      </View>
    );
  }

  // Show permission request screen if not all granted
  if (!allPermissionsGranted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>
          This app requires camera, microphone, and media library permissions to function properly.
        </Text>
        
        <View style={styles.permissionList}>
          <Text style={[styles.permissionItem, { color: cameraPermission?.granted ? 'green' : 'red' }]}>
            📷 Camera: {cameraPermission?.granted ? 'Granted' : 'Not Granted'}
          </Text>
          <Text style={[styles.permissionItem, { color: audioPermission?.granted ? 'green' : 'red' }]}>
            🎤 Microphone: {audioPermission?.granted ? 'Granted' : 'Not Granted'}
          </Text>
          <Text style={[styles.permissionItem, { color: mediaLibraryPermission?.granted ? 'green' : 'red' }]}>
            📁 Media Library: {mediaLibraryPermission?.granted ? 'Granted' : 'Not Granted'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: lightModeColors.auth.primaryGradient[0] }]}
          onPress={requestAllPermissions}
        >
          <Text style={styles.buttonText}>Request All Permissions</Text>
        </TouchableOpacity>
        
        <Text style={styles.permissionHint}>
          If permissions are denied, please enable them manually in your device settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: lightModeColors.background }]}>
      <CameraView ref={cameraRef} style={styles.camera} facing={cameraType} mode="video">
        <View style={styles.topControls}>
          <TouchableOpacity
            style={[styles.flipButton, { borderColor: lightModeColors.auth.switchLink }]}
            onPress={flipCamera}
          >
            <Text style={[styles.flipButtonText, { color: lightModeColors.auth.switchLink }]}>🔄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          {processing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={lightModeColors.auth.text} />
              <Text style={styles.processingText}>Analyzing sign language...</Text>
            </View>
          ) : (
            <View style={styles.recordingControls}>
              <TouchableOpacity
                onPress={recording ? stopRecording : startRecording}
                style={[styles.recordButton, { borderColor: lightModeColors.auth.primaryGradient[1] }]}
                disabled={processing}
              >
                <View style={[styles.recordButtonInner, { backgroundColor: lightModeColors.auth.secondaryGradient[0] }]} />
              </TouchableOpacity>
              <Text style={[styles.recordButtonText, { color: lightModeColors.auth.text }]}>
                {recording ? 'Tap to stop' : 'Tap to record'}
              </Text>
            </View>
          )}
        </View>
      </CameraView>

      {recording && (
        <View style={[styles.recordingIndicator, { backgroundColor: lightModeColors.auth.secondaryGradient[1] }]}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Recording...</Text>
        </View>
      )}

      {result && (
        <View style={[styles.resultContainer, { borderColor: lightModeColors.auth.primaryGradient[0] }]}>
          <Text style={[styles.resultTitle, { color: lightModeColors.auth.text }]}>Sign Detected</Text>
          <Text style={[styles.resultMain, { color: lightModeColors.auth.text }]}>{result.label}</Text>
          <Text style={[styles.resultDescription, { color: lightModeColors.auth.textSecondary }]}>
            {result.description}
          </Text>
          <TouchableOpacity onPress={clearResult} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  statusText: { color: '#555', fontSize: 16, marginTop: 16, textAlign: 'center' },
  permissionText: { color: '#333', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  permissionButton: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  topControls: { position: 'absolute', top: 50, right: 20, zIndex: 100 },
  flipButton: { borderWidth: 2, width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  flipButtonText: { fontSize: 24 },
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 50, alignItems: 'center' },
  processingContainer: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', padding: 20, borderRadius: 10 },
  processingText: { fontSize: 16, marginTop: 10 },
  recordingControls: { alignItems: 'center' },
  recordButton: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 4 },
  recordButtonInner: { width: 60, height: 60, borderRadius: 30 },
  recordButtonText: { fontSize: 14, marginTop: 10 },
  recordingIndicator: { position: 'absolute', top: 20, left: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  recordingDot: { width: 8, height: 8, backgroundColor: '#fff', borderRadius: 4, marginRight: 8 },
  recordingText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  resultContainer: { position: 'absolute', top: 100, left: 20, right: 20, backgroundColor: '#FFFBEB', padding: 20, borderRadius: 12, borderWidth: 2 },
  resultTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  resultMain: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  resultDescription: { fontSize: 16, textAlign: 'center' },
  clearButton: { position: 'absolute', top: 10, right: 10, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  clearButtonText: { fontSize: 18, fontWeight: 'bold' },
  errorContainer: { position: 'absolute', bottom: 50, left: 20, right: 20, backgroundColor: '#F44336', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  errorText: { color: '#fff', fontSize: 14, flex: 1 },
});