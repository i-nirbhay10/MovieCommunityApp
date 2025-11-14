import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../features/authSlice';

const COLORS = {
  primary: '#1B263B', // Royal Navy Blue
  secondary: '#D4AF37', // Deep Gold
  accent: '#FF6B6B', // Vibrant Coral
  background: '#F9FAFB', // Off-white
  text: '#2E2E2E', // Charcoal
};

export default function LoginScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const error = useSelector(s => s.auth.error);

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({email, password})).unwrap();
    } catch (e) {
      console.warn(e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue your journey</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Primary Button */}
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Don't have an account?{' '}
          <Text style={styles.registerHighlight}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 28,
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    marginTop: 14,
    fontSize: 16,
    color: COLORS.text,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
  },
  btn: {
    marginTop: 26,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  error: {
    marginTop: 10,
    color: COLORS.accent,
    fontWeight: '600',
  },
  registerText: {
    marginTop: 18,
    fontSize: 14,
    color: COLORS.text,
  },
  registerHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
