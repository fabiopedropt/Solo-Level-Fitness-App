import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '@expo/vector-icons';
import { useAuth } from '../utils/AuthContext';

enum AuthMode {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
}

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, signUp, resetPassword } = useAuth();

  const handleAuth = async () => {
    setLoading(true);
    
    try {
      if (mode === AuthMode.LOGIN) {
        // Handle login
        const { error } = await signIn(email, password, rememberMe);
        if (error) {
          Alert.alert('Login Failed', error.message);
        }
      } else if (mode === AuthMode.REGISTER) {
        // Validate passwords match
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          setLoading(false);
          return;
        }
        
        // Handle registration
        const { error } = await signUp(email, password, name);
        if (error) {
          Alert.alert('Registration Failed', error.message);
        } else {
          Alert.alert(
            'Registration Successful',
            'Please check your email to verify your account, then log in.',
            [
              {
                text: 'OK',
                onPress: () => setMode(AuthMode.LOGIN),
              },
            ]
          );
        }
      } else if (mode === AuthMode.FORGOT_PASSWORD) {
        // Handle forgot password
        const { error } = await resetPassword(email);
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert(
            'Password Reset Email Sent',
            'Please check your email for instructions to reset your password.',
            [
              {
                text: 'OK',
                onPress: () => setMode(AuthMode.LOGIN),
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case AuthMode.LOGIN:
        return (
          <>
            <View style={styles.inputContainer}>
              <Icon.Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Icon.Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon.Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.rememberContainer}>
              <View style={styles.rememberMe}>
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  trackColor={{ false: '#767577', true: '#4a4ae0' }}
                  thumbColor="#f4f3f4"
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </View>
              
              <TouchableOpacity onPress={() => setMode(AuthMode.FORGOT_PASSWORD)}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.authButtonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.switchModeContainer}>
              <Text style={styles.switchModeText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => setMode(AuthMode.REGISTER)}>
                <Text style={styles.switchModeButton}>Register</Text>
              </TouchableOpacity>
            </View>
          </>
        );
        
      case AuthMode.REGISTER:
        return (
          <>
            <View style={styles.inputContainer}>
              <Icon.Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Icon.Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Icon.Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon.Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Icon.Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
            
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.authButtonText}>Register</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.switchModeContainer}>
              <Text style={styles.switchModeText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => setMode(AuthMode.LOGIN)}>
                <Text style={styles.switchModeButton}>Login</Text>
              </TouchableOpacity>
            </View>
          </>
        );
        
      case AuthMode.FORGOT_PASSWORD:
        return (
          <>
            <Text style={styles.forgotPasswordText}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            
            <View style={styles.inputContainer}>
              <Icon.Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.authButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.switchModeContainer}>
              <TouchableOpacity onPress={() => setMode(AuthMode.LOGIN)}>
                <Text style={styles.switchModeButton}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/solo-leveling-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.tagline}>
            Train like Sung Jin-Woo and level up to become the strongest hunter you can be
          </Text>
          
          <View style={styles.formContainer}>
            {renderForm()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  tagline: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
    paddingBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    color: '#666',
  },
  forgotText: {
    color: '#4a4ae0',
  },
  authButton: {
    backgroundColor: '#4a4ae0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchModeText: {
    color: '#666',
  },
  switchModeButton: {
    color: '#4a4ae0',
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});