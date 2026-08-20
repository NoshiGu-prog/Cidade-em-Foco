# Configuração do aplicativo mobile

A aplicação será desenvolvida com React Native, Expo e TypeScript, utilizando React Native Paper para os componentes visuais.

## Criar o projeto Expo localmente

Na raiz do repositório, execute:

```bash
npx create-expo-app@latest mobile-app --template blank-typescript
```

Depois instale o React Native Paper:

```bash
cd mobile-app
npm install react-native-paper
npx expo install react-native-safe-area-context react-native-vector-icons
```

## Executar

```bash
npx expo start
```

O Expo exibirá um QR Code para abrir o projeto em um dispositivo com Expo Go ou em um emulador.

## Organização sugerida

```text
src/
├── components/
├── screens/
├── services/
├── types/
└── theme/
```

As primeiras telas da Unidade 1 serão Cadastro, Login e Registro de Ocorrência.
