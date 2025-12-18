import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, Shield, Loader } from 'lucide-react-native';
import { verifyIdentity } from '@/services/mockIdentityVerification';

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isVerifying, setIsVerifying] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [captureStep, setCaptureStep] = useState<'selfie' | 'id' | 'verifying'>('selfie');
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [idUri, setIdUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Camera size={48} color="#667eea" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.description}>
            We need access to your camera to verify your identity by taking a selfie and photo of your government ID.
          </Text>
          <Pressable style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      if (captureStep === 'selfie') {
        setSelfieUri('mock-selfie-uri');
        setFacing('back');
        setCaptureStep('id');
      } else if (captureStep === 'id') {
        setIdUri('mock-id-uri');
        setCaptureStep('verifying');
        await handleVerify();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);

    try {
      const result = await verifyIdentity({
        selfieImage: selfieUri || '',
        idImage: idUri || '',
      });

      if (result.success && result.nationalIdNumber) {
        router.push({
          pathname: '/register/government-data',
          params: { nationalIdNumber: result.nationalIdNumber },
        });
      } else {
        Alert.alert(
          'Verification Failed',
          result.error || 'Verification failed. Please ensure your ID is valid and your photo is clear.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                setCaptureStep('selfie');
                setSelfieUri(null);
                setIdUri(null);
                setFacing('front');
                setIsVerifying(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during verification. Please try again.');
      setCaptureStep('selfie');
      setSelfieUri(null);
      setIdUri(null);
      setFacing('front');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 1 of 3</Text>
        </View>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>
          {captureStep === 'selfie'
            ? 'Take a clear selfie facing the camera'
            : captureStep === 'id'
            ? 'Take a photo of your government ID'
            : 'Verifying your identity...'}
        </Text>
      </View>

      {captureStep === 'verifying' ? (
        <View style={styles.verifyingContainer}>
          <View style={styles.verifyingIconContainer}>
            <View style={styles.verifyingIconCircle}>
              <Loader size={48} color="#667eea" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.verifyingText}>Verifying your identity...</Text>
          <Text style={styles.verifyingSubtext}>This may take a few seconds</Text>
        </View>
      ) : (
        <>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
            />
            <View style={styles.overlay}>
              {captureStep === 'selfie' && (
                <View style={styles.faceGuide}>
                  <View style={styles.guideCircle}>
                    <View style={styles.guideInnerCircle} />
                  </View>
                  <Text style={styles.guideText}>Position your face in the frame</Text>
                </View>
              )}
              {captureStep === 'id' && (
                <View style={styles.idGuide}>
                  <View style={styles.guideRect} />
                  <Text style={styles.guideText}>Position your ID in the frame</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[styles.captureButton, isVerifying && styles.buttonDisabled]}
              onPress={handleCapture}
              disabled={isVerifying}
            >
              <Camera size={24} color="#fff" strokeWidth={2.5} />
              <Text style={styles.captureButtonText}>
                {captureStep === 'selfie' ? 'Capture Selfie' : 'Capture ID'}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 32,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#667eea',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#667eea',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    lineHeight: 24,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  faceGuide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: '#fff',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  guideInnerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  idGuide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideRect: {
    width: 320,
    height: 200,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
    borderStyle: 'solid',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  guideText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  footer: {
    padding: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  captureButton: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  verifyingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  verifyingIconContainer: {
    marginBottom: 32,
  },
  verifyingIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#667eea',
  },
  verifyingText: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  verifyingSubtext: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
