import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Phone, Mail, Calendar, Shield, LogOut, Languages } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';

export default function ProfileScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const [userData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    email: 'john.doe@example.com',
    dateOfBirth: '1990-05-15',
    role: 'VOTER',
  });

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('hasSeenOnboarding');
              router.replace('/');
            } catch (error) {
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <Pressable style={styles.languageHeaderButton} onPress={toggleLanguage}>
          <Languages size={24} color="#667eea" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <User size={48} color="#667eea" strokeWidth={2} />
          </View>
          <Text style={styles.name}>
            {userData?.firstName} {userData?.lastName}
          </Text>
          <Text style={styles.role}>{userData?.role}</Text>
        </View>

        <View style={styles.languageSection}>
          <Text style={styles.languageSectionTitle}>{t('profile.language')}</Text>
          <Pressable style={styles.languageButton} onPress={toggleLanguage}>
            <View style={styles.languageButtonContent}>
              <Languages size={24} color="#667eea" strokeWidth={2} />
              <View style={styles.languageButtonText}>
                <Text style={styles.languageText}>
                  {language === 'en' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
                </Text>
                <Text style={styles.languageSubtext}>
                  {language === 'en' ? t('profile.switchToTurkish') : t('profile.switchToEnglish')}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.personalInformation')}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <User size={20} color="#667eea" strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('profile.fullName')}</Text>
              <Text style={styles.infoValue}>
                {userData?.firstName} {userData?.lastName}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Calendar size={20} color="#667eea" strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('registration.dateOfBirth')}</Text>
              <Text style={styles.infoValue}>
                {userData?.dateOfBirth
                  ? new Date(userData.dateOfBirth).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Phone size={20} color="#667eea" strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('registration.phoneNumber')}</Text>
              <Text style={styles.infoValue}>{userData?.phoneNumber || 'N/A'}</Text>
            </View>
          </View>

          {userData?.email && (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Mail size={20} color="#667eea" strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('registration.email')}</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Shield size={20} color="#10b981" strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('profile.verificationStatus')}</Text>
              <Text style={styles.infoValue}>{t('profile.verified')}</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" strokeWidth={2.5} />
          <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  languageHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  scrollContent: {
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#667eea',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  languageSection: {
    marginBottom: 24,
  },
  languageSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  languageButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButtonText: {
    marginLeft: 16,
    flex: 1,
  },
  languageText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 4,
  },
  languageSubtext: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  infoRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
