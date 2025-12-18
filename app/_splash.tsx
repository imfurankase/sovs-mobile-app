import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Lock, CheckCircle2, ArrowRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface Slide {
  icon: any;
  titleKey: string;
  descriptionKey: string;
}

const slides: Slide[] = [
  {
    icon: Shield,
    titleKey: 'onboarding.slide1Title',
    descriptionKey: 'onboarding.slide1Description',
  },
  {
    icon: Lock,
    titleKey: 'onboarding.slide2Title',
    descriptionKey: 'onboarding.slide2Description',
  },
  {
    icon: CheckCircle2,
    titleKey: 'onboarding.slide3Title',
    descriptionKey: 'onboarding.slide3Description',
  },
];

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentSlide + 1),
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleSkip = async () => {
    await handleFinish();
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setTimeout(() => {
        router.replace('/');
      }, 100);
    } catch (error) {
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <View key={index} style={styles.slide}>
              <View style={styles.slideContent}>
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Icon size={64} color="#667eea" strokeWidth={2} />
                  </View>
                </View>
                <Text style={styles.title}>{t(slide.titleKey)}</Text>
                <Text style={styles.description}>{t(slide.descriptionKey)}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlide === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentSlide < slides.length - 1 ? (
            <>
              <Pressable style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>{t('onboarding.skip')}</Text>
              </Pressable>
              <Pressable style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>{t('onboarding.next')}</Text>
                <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.getStartedButton} onPress={handleFinish}>
              <Text style={styles.getStartedButtonText}>{t('onboarding.getStarted')}</Text>
              <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 48,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#667eea',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    paddingBottom: 48,
    paddingTop: 24,
    paddingHorizontal: 32,
    backgroundColor: '#f8f9fa',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#667eea',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  getStartedButton: {
    flex: 1,
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
