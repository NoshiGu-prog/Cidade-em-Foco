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
    imagem:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1519782539659-cb18d6e3cbb0?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1599581898731-0eb1e8f237f3?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1542106644-88db05634031?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1627914710188-75b2298c56cc?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1554528147-380d0d8ac93d?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1582298538104-fe2e74c87b8b?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1623910325413-eb04ec28203d?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1542223788-29ce459ed840?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1580840428574-8b6ee7b7a61c?auto=format&fit=crop&w=1170&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1559868414-2c26ea61530e?auto=format&fit=crop&w=1170&q=80",
  },
];
