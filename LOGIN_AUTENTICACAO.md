# Login e Validação

## Descrição

A tela de login realiza a validação dos campos de e-mail e senha antes
de permitir o acesso à aplicação.

A validação utiliza **React Hook Form** e **Zod**, seguindo a estrutura
já existente no projeto.

## Funcionamento

O fluxo implementado é:

1.  O usuário informa o e-mail e a senha.
2.  Os campos são validados pelo formulário.
3.  Caso os dados sejam inválidos, a aplicação informa os erros de
    preenchimento.
4.  Caso os dados sejam válidos, o usuário é direcionado para a tela de
    **Registro de Ocorrência**.

## Arquivo alterado

`src/screens/LoginScreen.tsx`

Foi adicionada a navegação para a rota `RegistroOcorrencia` após a
validação do formulário:

``` tsx
const onSubmit = (data: LoginFormData) => {
  console.log("Login válido", data);
  navigation.navigate("RegistroOcorrencia");
};
```

A rota `RegistroOcorrencia` já estava configurada no projeto.

## Observação

Nesta etapa, o login realiza apenas a validação local dos campos. A
autenticação com usuário e senha armazenados no backend será
implementada posteriormente.
