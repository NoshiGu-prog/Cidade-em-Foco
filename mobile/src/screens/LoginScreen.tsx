import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
      <Text variant="headlineMedium">Cidade em Foco</Text>
      <Text variant="bodyLarge">Entre para acompanhar e registrar ocorrências</Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button mode="contained" onPress={() => {}}>
        Entrar
      </Button>

      <Button mode="text" onPress={() => {}}>
        Criar conta
      </Button>
    </View>
  );
}
