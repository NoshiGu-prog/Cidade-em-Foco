# Cidade em Foco

Aplicativo de apoio ao registro e à gestão de ocorrências urbanas, permitindo que cidadãos informem problemas encontrados na cidade com foto, descrição e localização.

## Integrantes

- Gustavo Brandão
- Eduarda Carvalho
- Mere Helen Bispo

## Objetivo

O Cidade em Foco busca facilitar a comunicação entre cidadãos e a gestão urbana, permitindo registrar ocorrências, acompanhar seu status e visualizar problemas registrados na cidade.

## Funcionalidades planejadas

1. Cadastro de usuário
2. Login e autenticação
3. Registro de ocorrência com foto, descrição e localização
4. Geração de descrição da ocorrência com apoio de IA
5. Visualização das ocorrências em lista
6. Visualização das ocorrências no mapa
7. Acompanhamento do status da ocorrência
8. Painel administrativo de ocorrências
9. Atualização e histórico do status das ocorrências
10. Identificação e agrupamento de ocorrências semelhantes
11. Priorização inteligente das ocorrências para atendimento

## Primeira entrega

Na primeira unidade foram desenvolvidos e integrados os fluxos iniciais do aplicativo:

- Cadastro de usuário com validação dos campos
- Login com validação e navegação para o registro de ocorrência
- Registro de ocorrência com seleção e pré-visualização de foto
- Obtenção de localização por latitude e longitude
- Exibição de endereço aproximado por geocodificação reversa
- Descrição da ocorrência
- Indicação de ocorrência perigosa
- Validações e mensagens de retorno ao usuário

Os fluxos da primeira entrega foram testados de forma integrada no front-end.

> Nesta etapa, cadastro, login e registro de ocorrência ainda não possuem persistência em banco de dados. A autenticação real de usuários, o armazenamento das ocorrências e o upload permanente das imagens serão integrados posteriormente com o backend.

## Tecnologias

O aplicativo está sendo desenvolvido com:

- TypeScript
- React Native
- Expo
- React Navigation
- React Native Paper
- React Hook Form
- Zod
- Expo Image Picker
- Expo Location
- Lucide React Native
- Node.js e npm para execução do ambiente de desenvolvimento e gerenciamento das dependências

## Estrutura de branches

O projeto utiliza uma organização baseada em GitFlow:

- `main`: versão estável do projeto
- `develop`: integração das funcionalidades em desenvolvimento
- `feature/*`: branches utilizadas para o desenvolvimento de funcionalidades específicas

As funcionalidades são desenvolvidas em branches próprias e integradas à `develop` antes de serem enviadas para a `main`.

## Como executar

Com Node.js e npm instalados, execute:

```bash
npm install
npm start
```

O Expo permitirá executar o projeto nas plataformas disponíveis durante o desenvolvimento.

## Estado atual

A primeira etapa do front-end está integrada e testada. As próximas unidades avançarão para as demais funcionalidades planejadas, incluindo persistência de dados, acompanhamento das ocorrências, visualização em mapa e recursos inteligentes.
