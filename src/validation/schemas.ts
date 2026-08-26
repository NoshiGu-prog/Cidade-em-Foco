import { cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Informe um e-mail válido"),
  senha: z.string().min(1, "Informe sua senha"),
});

export const cadastroSchema = z
  .object({
    nome: z.string().trim().min(3, "Informe seu nome completo"),
    cpf: z
      .string()
      .trim()
      .min(1, "Informe seu CPF")
      .refine((value) => cpf.isValid(value), {
        message: "Informe um CPF válido",
      }),
    cidade: z.string().trim().min(1, "Informe sua cidade"),
    email: z.string().min(1, "Informe um e-mail válido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme sua senha"),
    termos: z.boolean().refine((value) => value, {
      message: "Você precisa aceitar a declaração",
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    error: "As senhas não coincidem",
  });

export const ocorrenciaSchema = z.object({
  descricao: z.string().trim().min(10, "Descreva a ocorrência com detalhes"),
  perigosa: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CadastroFormData = z.infer<typeof cadastroSchema>;
export type OcorrenciaFormData = z.infer<typeof ocorrenciaSchema>;
