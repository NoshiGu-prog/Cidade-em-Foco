import { OcorrenciaType } from "../types/ocorrencia";

export const ocorrenciasMock: OcorrenciaType[] = [
  {
    id: "1",
    descricao:
      "Buraco profundo na faixa da direita, causando danos aos veículos",
    latitude: -29.168341,
    longitude: -51.17911,
    criadaEm: new Date("2026-09-23T08:30:00"),
    perigosa: true,
    status: "ENVIADA",
    endereco: "Av. Júlio de Castilhos, 1500 - Centro",
    imagem: "https://picsum.photos/id/1044/500/300", // Rua/Asfalto
  },
  {
    id: "2",
    descricao: "Poste com lâmpada queimada há mais de uma semana",
    latitude: -29.173012,
    longitude: -51.175034,
    criadaEm: new Date("2026-09-21T19:45:00"),
    perigosa: false,
    status: "EM_ANALISE",
    endereco: "Rua Plácido de Castro, 300 - Exposição",
    imagem: "https://picsum.photos/id/122/500/300", // Rua escura/noite
  },
  {
    id: "3",
    descricao:
      "Árvore de grande porte caiu sobre o muro da praça após o temporal",
    latitude: -29.167055,
    longitude: -51.185077,
    criadaEm: new Date("2026-09-22T06:15:00"),
    perigosa: true,
    status: "EM_ANDAMENTO",
    endereco: "Av. Rio Branco, 400 - São Pelegrino",
    imagem: "https://picsum.photos/id/293/500/300", // Árvores/Natureza
  },
  {
    id: "4",
    descricao: "Vazamento de água limpa no meio fio",
    latitude: -29.171033,
    longitude: -51.165099,
    criadaEm: new Date("2026-09-20T14:20:00"),
    perigosa: false,
    status: "ENVIADA",
    endereco: "Rua Sinimbu, 2200 - Lourdes",
    imagem: "https://picsum.photos/id/175/500/300", // Rua da cidade
  },
  {
    id: "5",
    descricao: "Descarte irregular de lixo e entulho em terreno baldio",
    latitude: -29.185012,
    longitude: -51.220045,
    criadaEm: new Date("2026-09-18T10:10:00"),
    perigosa: false,
    status: "RESOLVIDA",
    endereco: "Rua Cristiano Ramos de Oliveira, 850 - Desvio Rizzo",
    imagem: "https://picsum.photos/id/195/500/300", // Terreno/Estrutura
  },
  {
    id: "6",
    descricao: "Fio de alta tensão rompido e caído na calçada",
    latitude: -29.160021,
    longitude: -51.180066,
    criadaEm: new Date("2026-09-23T11:05:00"),
    perigosa: true,
    status: "ENVIADA",
    endereco: "Rua Moreira César, 1100 - Pio X",
    imagem: "https://picsum.photos/id/133/500/300", // Carros e postes urbanos
  },
  {
    id: "7",
    descricao: "Tampa de bueiro roubada, risco de queda para pedestres",
    latitude: -29.178044,
    longitude: -51.155088,
    criadaEm: new Date("2026-09-19T09:30:00"),
    perigosa: true,
    status: "EM_ANDAMENTO",
    endereco: "Rua Luiz Michielon, 550 - Cruzeiro",
    imagem: "https://picsum.photos/id/164/500/300", // Detalhe de rua
  },
  {
    id: "8",
    descricao: "Semáforo piscando no amarelo o dia todo, trânsito perigoso",
    latitude: -29.1645,
    longitude: -51.177,
    criadaEm: new Date("2026-09-23T13:45:00"),
    perigosa: true,
    status: "ENVIADA",
    endereco:
      "Esquina da Rua Visconde de Pelotas com Pinheiro Machado - Centro",
    imagem: "https://picsum.photos/id/274/500/300", // Luzes da cidade
  },
  {
    id: "9",
    descricao: "Foco de dengue: Pneus acumulando água da chuva",
    latitude: -29.160533,
    longitude: -51.195511,
    criadaEm: new Date("2026-09-15T16:00:00"),
    perigosa: true,
    status: "RESOLVIDA",
    endereco: "Rua Matteo Gianella, 120 - Santa Catarina",
    imagem: "https://picsum.photos/id/1064/500/300", // Rua/Calçada
  },
  {
    id: "10",
    descricao: "Pequeno deslizamento de terra invadindo o acostamento",
    latitude: -29.230055,
    longitude: -51.160012,
    criadaEm: new Date("2026-09-22T08:00:00"),
    perigosa: true,
    status: "EM_ANALISE",
    endereco: "BR-116, Km 160 - Galópolis",
    imagem: "https://picsum.photos/id/355/500/300", // Estrada de terra/acostamento
  },
  {
    id: "11",
    descricao: "Placa de 'PARE' derrubada na esquina",
    latitude: -29.155022,
    longitude: -51.160044,
    criadaEm: new Date("2026-09-21T14:15:00"),
    perigosa: false,
    status: "ENVIADA",
    endereco: "Rua João Nichele, 200 - São José",
    imagem: "https://picsum.photos/id/183/500/300", // Elementos urbanos/Veículo
  },
  {
    id: "12",
    descricao: "Solicitação de pintura de faixa de pedestres apagada",
    latitude: -29.100088,
    longitude: -51.120033,
    criadaEm: new Date("2026-08-30T10:00:00"),
    perigosa: false,
    status: "RESOLVIDA",
    endereco: "Av. Rio Branco, 3000 - Ana Rech",
    imagem: "https://picsum.photos/id/1055/500/300", // Crossover/Cena urbana
  },
  {
    id: "13",
    descricao: "Poste de madeira inclinado, risco de queda iminente",
    latitude: -29.145066,
    longitude: -51.190022,
    criadaEm: new Date("2026-09-23T15:20:00"),
    perigosa: true,
    status: "ENVIADA",
    endereco: "Rua Ludovico Cavinato, 1000 - Nossa Sra. da Saúde",
    imagem: "https://picsum.photos/id/318/500/300", // Paisagem com elementos verticais
  },
];
