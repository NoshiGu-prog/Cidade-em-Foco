import React from 'react';
import { View } from 'react-native';
import { Button, Switch, Text, TextInput } from 'react-native-paper';

export function RegistroOcorrenciaScreen() {
  const [descricao, setDescricao] = React.useState('');
  const [perigosa, setPerigosa] = React.useState(false);

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text variant="headlineMedium">Nova ocorrência</Text>

      <Button mode="outlined" icon="camera" onPress={() => {}}>
        Adicionar foto
      </Button>

      <Button mode="outlined" icon="map-marker" onPress={() => {}}>
        Obter localização
      </Button>

      <TextInput
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={5}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Ocorrência perigosa</Text>
        <Switch value={perigosa} onValueChange={setPerigosa} />
      </View>

      <Button mode="contained" onPress={() => {}}>
        Registrar ocorrência
      </Button>
    </View>
  );
}
