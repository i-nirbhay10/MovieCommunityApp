import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../features/authSlice';

export default function RegisterScreen({navigation}) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const error = useSelector(s => s.auth.error);

  const handleRegister = async () => {
    if (!email || !password || !name) return alert('Fill all fields');
    try {
      await dispatch(registerUser({name, email, password})).unwrap();
    } catch (e) {
      console.warn(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join our premium community</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#888"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1B263B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#2E2E2E',
    opacity: 0.7,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    marginTop: 14,
    fontSize: 16,
    color: '#2E2E2E',

    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
  },
  btn: {
    marginTop: 26,
    backgroundColor: '#1B263B',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',

    shadowColor: '#D4AF37',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  error: {
    marginTop: 10,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    color: '#2E2E2E',
  },
  loginHighlight: {
    color: '#1B263B',
    fontWeight: '600',
  },
});
