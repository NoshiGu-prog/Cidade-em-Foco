import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export function CadastroScreen() {
  const [nome, setNome] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [cidade, setCidade] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text variant="headlineMedium">Crie sua conta</Text>

      <TextInput label="Nome completo" value={nome} onChangeText={setNome} />
      <TextInput label="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
      <TextInput label="Cidade" value={cidade} onChangeText={setCidade} />
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      <Button mode="contained" onPress={() => {}}>
        Criar conta
      </Button>
    </ScrollView>
  );
}
