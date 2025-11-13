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
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={{color: 'red'}}>{error} </Text> : null}
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{marginTop: 12}}> Don't have an account? Register </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {fontSize: 26, fontWeight: '700', marginBottom: 20},
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  btn: {
    marginTop: 18,
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  btnText: {color: 'white', textAlign: 'center', fontWeight: '700'},
});
