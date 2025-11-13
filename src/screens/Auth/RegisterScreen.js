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
      <Text style={styles.title}>Create account</Text>
      <TextInput
        placeholder="Full name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={{color: 'red'}}>{error} </Text> : null}
      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{marginTop: 12}}>Already have an account? Login </Text>
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
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  btnText: {color: 'white', textAlign: 'center', fontWeight: '700'},
});
