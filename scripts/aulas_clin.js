import {
  checkAuthState,
  checkSaldoMensagens,
} from './authValidation_simp.js';
const apikey =
  'sk-svcacct-O2j973wau_vjoOPAv-KHLmrQp9bgJOyYobANHOtHGnJYjhSxvfp8GEOH05mi-OT3BlbkFJLddpSqXDC0qxgELyuyEajb05wnZXgmgszVJPEwZt4pg8vK2etWewgpjK9DF6gA';
const subjects = {
  "Cirurgia Geral": {
    id: "cirurgiaGeral",
    title: "Cirurgia Geral",
    details:
      "Conheça os fundamentos da prática cirúrgica.\nSelecione uma aula para saber mais:\n1. Técnica Cirúrgica Básica\n2. Anestesiologia\n3. Cuidados Pós-operatórios\n4. Cirurgias de Urgência\n5. Cirurgias Torácicas\n6. Cirurgia Vascular\n7. Cirurgia Oncológica\n8. Cirurgia Laparoscópica\n9. Cirurgia do Trauma\n10. Infecções Cirúrgicas\n11. Cirurgia Cardiovascular\n12. Cirurgia Digestiva\n13. Manejo de Pacientes Críticos no Pós-operatório\n14. Complicações Pós-operatórias\n15. Cirurgia Ambulatorial",
    subtopics: {
      1: "Técnica Cirúrgica Básica: Princípios fundamentais de cirurgia.",
      2: "Anestesiologia: Técnicas de anestesia para procedimentos cirúrgicos.",
      3: "Cuidados Pós-operatórios: Manejo de pacientes após cirurgia.",
      4: "Cirurgias de Urgência: Procedimentos cirúrgicos em situações de emergência.",
      5: "Cirurgias Torácicas: Cirurgias que envolvem órgãos do tórax.",
      6: "Cirurgia Vascular: Intervenções cirúrgicas nos vasos sanguíneos.",
      7: "Cirurgia Oncológica: Tratamento cirúrgico de neoplasias.",
      8: "Cirurgia Laparoscópica: Procedimentos minimamente invasivos.",
      9: "Cirurgia do Trauma: Tratamento cirúrgico de traumas e lesões.",
      10: "Infecções Cirúrgicas: Prevenção e tratamento de infecções pós-cirúrgicas.",
      11: "Cirurgia Cardiovascular: Cirurgia de coração e vasos.",
      12: "Cirurgia Digestiva: Procedimentos que envolvem o sistema digestivo.",
      13: "Manejo de Pacientes Críticos no Pós-operatório: Cuidados de pacientes graves.",
      14: "Complicações Pós-operatórias: Gerenciamento de complicações cirúrgicas.",
      15: "Cirurgia Ambulatorial: Procedimentos realizados sem internação hospitalar."
    }
  },
  "Ginecologia e Obstetrícia": {
    id: "ginecologiaObstetricia",
    title: "Ginecologia e Obstetrícia",
    details:
      "Explore o cuidado com a saúde da mulher e a reprodução.\nSelecione uma aula para saber mais:\n1. Fisiologia Reprodutiva\n2. Cuidado Pré-natal\n3. Parto Normal e Complicações\n4. Puerpério\n5. Planejamento Familiar e Contracepção\n6. Doenças Ginecológicas Comuns\n7. Infertilidade e Tratamentos\n8. Oncologia Ginecológica\n9. Endometriose\n10. Menopausa e Alterações Hormonais\n11. Saúde Sexual Feminina\n12. Infecções Sexualmente Transmissíveis\n13. Cirurgia Ginecológica\n14. Cuidados Neonatais\n15. Emergências Obstétricas",
    subtopics: {
      1: "Fisiologia Reprodutiva: Estudo do sistema reprodutivo feminino.",
      2: "Cuidado Pré-natal: Cuidados e acompanhamento durante a gestação.",
      3: "Parto Normal e Complicações: Tipos de parto e seus riscos.",
      4: "Puerpério: Recuperação e cuidados pós-parto.",
      5: "Planejamento Familiar e Contracepção: Métodos de controle de natalidade.",
      6: "Doenças Ginecológicas Comuns: Patologias frequentes no sistema reprodutivo feminino.",
      7: "Infertilidade e Tratamentos: Abordagem da infertilidade e terapias.",
      8: "Oncologia Ginecológica: Cânceres que afetam o sistema reprodutivo feminino.",
      9: "Endometriose: Condição e tratamento.",
      10: "Menopausa e Alterações Hormonais: Mudanças hormonais e seus efeitos.",
      11: "Saúde Sexual Feminina: Questões e cuidados relacionados à saúde sexual.",
      12: "Infecções Sexualmente Transmissíveis: Diagnóstico e prevenção.",
      13: "Cirurgia Ginecológica: Procedimentos cirúrgicos no sistema reprodutivo.",
      14: "Cuidados Neonatais: Tratamento e acompanhamento de recém-nascidos.",
      15: "Emergências Obstétricas: Situações críticas durante a gestação e parto."
    }
  },
  // Continue com o mesmo padrão para as outras especialidades

  "Psiquiatria": {
    id: "psiquiatria",
    title: "Psiquiatria",
    details:
      "Diagnóstico e tratamento de transtornos mentais.\nSelecione uma aula para saber mais:\n1. Diagnóstico de Transtornos Psiquiátricos\n2. Psicofarmacologia\n3. Transtornos de Ansiedade\n4. Transtornos Depressivos\n5. Transtornos de Personalidade\n6. Transtornos Psicóticos\n7. Abuso de Substâncias e Dependência Química\n8. Transtornos Alimentares\n9. Transtornos do Humor\n10. Terapias Cognitivo-Comportamentais\n11. Suicídio e Comportamento Autolesivo\n12. Psiquiatria Infantil\n13. Atendimento em Crises Psiquiátricas\n14. Psicogeriatria\n15. Transtornos de Estresse Pós-traumático (TEPT)",
    subtopics: {
      1: "Diagnóstico de Transtornos Psiquiátricos: Critérios e ferramentas de diagnóstico.",
      2: "Psicofarmacologia: Medicamentos utilizados no tratamento de transtornos mentais.",
      3: "Transtornos de Ansiedade: Abordagem e tratamento da ansiedade patológica.",
      4: "Transtornos Depressivos: Diagnóstico e tratamento da depressão.",
      5: "Transtornos de Personalidade: Alterações persistentes no comportamento.",
      6: "Transtornos Psicóticos: Tratamento de doenças que afetam a percepção da realidade.",
      7: "Abuso de Substâncias e Dependência Química: Diagnóstico e manejo da dependência.",
      8: "Transtornos Alimentares: Anorexia, bulimia e outros distúrbios alimentares.",
      9: "Transtornos do Humor: Bipolaridade e outras condições que afetam o humor.",
      10: "Terapias Cognitivo-Comportamentais: Técnicas terapêuticas para transtornos mentais.",
      11: "Suicídio e Comportamento Autolesivo: Prevenção e manejo de situações críticas.",
      12: "Psiquiatria Infantil: Diagnóstico e tratamento de transtornos mentais em crianças.",
      13: "Atendimento em Crises Psiquiátricas: Abordagem de situações de urgência mental.",
      14: "Psicogeriatria: Tratamento de transtornos mentais em idosos.",
      15: "Transtornos de Estresse Pós-traumático (TEPT): Diagnóstico e manejo de TEPT."
    }
  },
  "Infectologia": {
    id: "infectologia",
    title: "Infectologia",
    details:
      "Diagnóstico e tratamento de doenças infecciosas.\nSelecione uma aula para saber mais:\n1. Doenças Bacterianas Comuns\n2. Doenças Virais (HIV, Hepatites, Dengue)\n3. Doenças Fúngicas e Parasitoses\n4. Tuberculose\n5. Doenças Sexualmente Transmissíveis (DSTs)\n6. Endemias e Epidemias (Malária, Chikungunya, Zika)\n7. Controle de Infecções Hospitalares\n8. Infecções Resistentes a Antibióticos\n9. Infecções Respiratórias\n10. HIV/AIDS: Diagnóstico e Tratamento\n11. Meningite e Sepse\n12. Imunizações e Profilaxia\n13. Infecções Oportunistas\n14. Infecções de Pele e Partes Moles\n15. Zoonoses",
    subtopics: {
      1: "Doenças Bacterianas Comuns: Diagnóstico e tratamento de infecções bacterianas.",
      2: "Doenças Virais: Abordagem de infecções virais, incluindo HIV e hepatites.",
      3: "Doenças Fúngicas e Parasitoses: Tratamento de infecções por fungos e parasitas.",
      4: "Tuberculose: Diagnóstico e manejo da tuberculose.",
      5: "Doenças Sexualmente Transmissíveis (DSTs): Diagnóstico e prevenção de DSTs.",
      6: "Endemias e Epidemias: Abordagem de doenças em surtos e epidemias.",
      7: "Controle de Infecções Hospitalares: Prevenção e controle de infecções nosocomiais.",
      8: "Infecções Resistentes a Antibióticos: Tratamento e prevenção de resistências.",
      9: "Infecções Respiratórias: Abordagem de doenças respiratórias infecciosas.",
      10: "HIV/AIDS: Diagnóstico e Tratamento: Manejo clínico de pacientes com HIV/AIDS.",
      11: "Meningite e Sepse: Abordagem de infecções graves do sistema nervoso e do sangue.",
      12: "Imunizações e Profilaxia: Vacinas e medidas preventivas.",
      13: "Infecções Oportunistas: Tratamento de infecções em pacientes imunossuprimidos.",
      14: "Infecções de Pele e Partes Moles: Diagnóstico e tratamento de infecções cutâneas.",
      15: "Zoonoses: Doenças transmitidas de animais para humanos."
    }
  },
  "Dermatologia": {
    id: "dermatologia",
    title: "Dermatologia",
    details:
      "Estudo das doenças de pele e tratamentos dermatológicos.\nSelecione uma aula para saber mais:\n1. Fisiopatologia da Pele\n2. Doenças Infecciosas da Pele\n3. Psoríase e Dermatites\n4. Câncer de Pele (Melanoma, Carcinomas)\n5. Acne e Tratamentos Dermatológicos\n6. Doenças Autoimunes da Pele\n7. Infecções Fúngicas e Virais Cutâneas\n8. Tricologia (Doenças do Cabelo)\n9. Dermatoses Ocupacionais\n10. Lesões Cutâneas Pré-cancerosas\n11. Dermatologia Estética\n12. Dermatologia Pediátrica\n13. Tratamento de Úlceras e Feridas\n14. Diagnóstico Diferencial de Lesões Pigmentadas\n15. Dermatoscopia",
    subtopics: {
      1: "Fisiopatologia da Pele: Estudo das funções e patologias da pele.",
      2: "Doenças Infecciosas da Pele: Tratamento de infecções cutâneas bacterianas, virais e fúngicas.",
      3: "Psoríase e Dermatites: Abordagem de doenças inflamatórias da pele.",
      4: "Câncer de Pele: Diagnóstico e tratamento de cânceres cutâneos.",
      5: "Acne e Tratamentos Dermatológicos: Manejo da acne e outras condições da pele.",
      6: "Doenças Autoimunes da Pele: Abordagem de doenças autoimunes que afetam a pele.",
      7: "Infecções Fúngicas e Virais Cutâneas: Tratamento de infecções da pele por fungos e vírus.",
      8: "Tricologia: Estudo das doenças que afetam o cabelo.",
      9: "Dermatoses Ocupacionais: Doenças de pele relacionadas ao ambiente de trabalho.",
      10: "Lesões Cutâneas Pré-cancerosas: Diagnóstico e manejo de lesões com potencial cancerígeno.",
      11: "Dermatologia Estética: Procedimentos para melhoria da aparência da pele.",
      12: "Dermatologia Pediátrica: Abordagem dermatológica em crianças.",
      13: "Tratamento de Úlceras e Feridas: Cuidados com lesões cutâneas.",
      14: "Diagnóstico Diferencial de Lesões Pigmentadas: Identificação de lesões pigmentadas.",
      15: "Dermatoscopia: Técnica de exame de lesões da pele."
    }
  },
  "Neurologia": {
    id: "neurologia",
    title: "Neurologia",
    details:
      "Diagnóstico e manejo de doenças neurológicas.\nSelecione uma aula para saber mais:\n1. Semiologia Neurológica\n2. Doenças Vasculares Cerebrais (AVC)\n3. Transtornos Neurodegenerativos (Parkinson, Alzheimer)\n4. Epilepsia\n5. Doenças Desmielinizantes (Esclerose Múltipla)\n6. Neuropatias Periféricas\n7. Traumas Neurológicos\n8. Neuroinfecções (Meningite, Encefalite)\n9. Cefaleias e Enxaquecas\n10. Doenças do Movimento\n11. Neurologia Infantil\n12. Tumores do Sistema Nervoso\n13. Neurologia de Urgência\n14. Reabilitação Neurológica\n15. Exames Complementares em Neurologia",
    subtopics: {
      1: "Semiologia Neurológica: Exame clínico neurológico e interpretação dos sinais.",
      2: "Doenças Vasculares Cerebrais: Estudo do acidente vascular cerebral e suas complicações.",
      3: "Transtornos Neurodegenerativos: Diagnóstico e tratamento de doenças como Parkinson e Alzheimer.",
      4: "Epilepsia: Diagnóstico e manejo de crises epilépticas.",
      5: "Doenças Desmielinizantes: Abordagem da esclerose múltipla e outras doenças desmielinizantes.",
      6: "Neuropatias Periféricas: Diagnóstico e tratamento de doenças que afetam os nervos periféricos.",
      7: "Traumas Neurológicos: Abordagem de lesões traumáticas no sistema nervoso.",
      8: "Neuroinfecções: Diagnóstico e tratamento de infecções no sistema nervoso central, como meningite.",
      9: "Cefaleias e Enxaquecas: Diagnóstico e manejo das dores de cabeça.",
      10: "Doenças do Movimento: Abordagem de doenças que afetam o controle motor.",
      11: "Neurologia Infantil: Diagnóstico e tratamento de doenças neurológicas em crianças.",
      12: "Tumores do Sistema Nervoso: Diagnóstico e manejo de neoplasias no sistema nervoso.",
      13: "Neurologia de Urgência: Manejo de emergências neurológicas.",
      14: "Reabilitação Neurológica: Tratamento de pacientes com sequelas neurológicas.",
      15: "Exames Complementares em Neurologia: Métodos diagnósticos em neurologia."
    }
  },
  "Ortopedia e Traumatologia": {
    id: "ortopediaTraumatologia",
    title: "Ortopedia e Traumatologia",
    details:
      "Tratamento de fraturas, lesões e traumas musculosqueléticos.\nSelecione uma aula para saber mais:\n1. Diagnóstico e Tratamento de Fraturas\n2. Lesões Musculoesqueléticas\n3. Artroplastias\n4. Cirurgia de Coluna\n5. Cirurgia de Mão e Membros Superiores\n6. Lesões Esportivas\n7. Deformidades Congênitas\n8. Ortopedia Pediátrica\n9. Reabilitação Ortopédica\n10. Osteoartrose\n11. Osteoporose\n12. Doenças Inflamatórias das Articulações\n13. Cirurgias Minimamente Invasivas em Ortopedia\n14. Traumas Complexos (Politraumas)\n15. Diagnóstico por Imagem em Ortopedia",
    subtopics: {
      1: "Diagnóstico e Tratamento de Fraturas: Manejo de fraturas ósseas.",
      2: "Lesões Musculoesqueléticas: Diagnóstico e tratamento de lesões em músculos e articulações.",
      3: "Artroplastias: Cirurgias de substituição de articulações.",
      4: "Cirurgia de Coluna: Abordagem cirúrgica de patologias da coluna vertebral.",
      5: "Cirurgia de Mão e Membros Superiores: Tratamento de lesões e deformidades da mão.",
      6: "Lesões Esportivas: Diagnóstico e tratamento de lesões relacionadas ao esporte.",
      7: "Deformidades Congênitas: Correção de deformidades presentes ao nascimento.",
      8: "Ortopedia Pediátrica: Tratamento de doenças ortopédicas em crianças.",
      9: "Reabilitação Ortopédica: Recuperação e reabilitação pós-traumática.",
      10: "Osteoartrose: Manejo da artrose e suas complicações.",
      11: "Osteoporose: Diagnóstico e tratamento da perda de massa óssea.",
      12: "Doenças Inflamatórias das Articulações: Tratamento de artrites e outras inflamações.",
      13: "Cirurgias Minimamente Invasivas em Ortopedia: Técnicas cirúrgicas menos invasivas.",
      14: "Traumas Complexos (Politraumas): Abordagem de pacientes com múltiplas lesões.",
      15: "Diagnóstico por Imagem em Ortopedia: Uso de radiografias e outros exames de imagem."
    }
  },
  
  	  "Pediatria": {
    id: "pediatria",
    title: "Pediatria",
    details:
      "Entenda o desenvolvimento e as doenças na infância.\nSelecione uma aula para saber mais:\n1. Desenvolvimento Físico e Psicomotor\n2. Nutrição Pediátrica\n3. Vacinação\n4. Doenças Infecciosas Comuns na Infância\n5. Neonatologia\n6. Emergências Pediátricas\n7. Distúrbios do Crescimento\n8. Distúrbios Endócrinos em Crianças\n9. Imunologia Pediátrica\n10. Alergias e Doenças Autoimunes em Crianças\n11. Doenças Respiratórias Pediátricas\n12. Gastroenterologia Pediátrica\n13. Oncologia Pediátrica\n14. Cardiopatias Congênitas\n15. Cuidados Intensivos Pediátricos",
    subtopics: {
      1: "Desenvolvimento Físico e Psicomotor: Estudo das etapas do desenvolvimento infantil.",
      2: "Nutrição Pediátrica: Alimentação e necessidades nutricionais na infância.",
      3: "Vacinação: Imunização e seu papel na prevenção de doenças.",
      4: "Doenças Infecciosas Comuns na Infância: Principais infecções e seu tratamento.",
      5: "Neonatologia: Cuidados com recém-nascidos e prematuros.",
      6: "Emergências Pediátricas: Abordagem de situações de emergência em crianças.",
      7: "Distúrbios do Crescimento: Avaliação e tratamento de alterações no crescimento.",
      8: "Distúrbios Endócrinos em Crianças: Patologias hormonais pediátricas.",
      9: "Imunologia Pediátrica: Sistema imunológico infantil e suas particularidades.",
      10: "Alergias e Doenças Autoimunes em Crianças: Diagnóstico e manejo.",
      11: "Doenças Respiratórias Pediátricas: Patologias que afetam o sistema respiratório infantil.",
      12: "Gastroenterologia Pediátrica: Distúrbios do trato gastrointestinal em crianças.",
      13: "Oncologia Pediátrica: Câncer infantil e tratamentos.",
      14: "Cardiopatias Congênitas: Anomalias cardíacas presentes ao nascimento.",
      15: "Cuidados Intensivos Pediátricos: Manejo de pacientes pediátricos críticos."
    }
  },
   "Oftalmologia": {
    id: "oftalmologia",
    title: "Oftalmologia",
    details:
      "Estudo das doenças oculares e tratamentos.\nSelecione uma aula para saber mais:\n1. Anatomia do Olho\n2. Doenças da Córnea\n3. Catarata e Cirurgia de Catarata\n4. Glaucoma\n5. Doenças da Retina\n6. Uveítes\n7. Refração e Erros Refrativos\n8. Estrabismo\n9. Oftalmologia Pediátrica\n10. Cirurgia Ocular\n11. Doenças Orbitárias\n12. Tumores Oculares\n13. Degeneração Macular Relacionada à Idade (DMRI)\n14. Traumas Oculares\n15. Exames Complementares em Oftalmologia",
    subtopics: {
      1: "Anatomia do Olho: Estrutura anatômica do globo ocular.",
      2: "Doenças da Córnea: Patologias que afetam a córnea e seus tratamentos.",
      3: "Catarata e Cirurgia de Catarata: Manejo da catarata e técnicas cirúrgicas.",
      4: "Glaucoma: Diagnóstico e tratamento do aumento da pressão intraocular.",
      5: "Doenças da Retina: Doenças que afetam a retina, como descolamento e retinopatia.",
      6: "Uveítes: Inflamação da úvea e tratamento.",
      7: "Refração e Erros Refrativos: Diagnóstico de miopia, hipermetropia, astigmatismo e presbiopia.",
      8: "Estrabismo: Diagnóstico e tratamento do desalinhamento ocular.",
      9: "Oftalmologia Pediátrica: Tratamento de doenças oculares em crianças.",
      10: "Cirurgia Ocular: Técnicas cirúrgicas oftalmológicas.",
      11: "Doenças Orbitárias: Patologias que afetam as órbitas oculares.",
      12: "Tumores Oculares: Diagnóstico e tratamento de neoplasias oculares.",
      13: "Degeneração Macular Relacionada à Idade (DMRI): Abordagem de doenças maculares.",
      14: "Traumas Oculares: Tratamento de lesões traumáticas nos olhos.",
      15: "Exames Complementares em Oftalmologia: Métodos diagnósticos, como tonometria e fundoscopia."
    }
  },
	  "Urologia": {
    id: "urologia",
    title: "Urologia",
    details:
      "Estudo das doenças do trato urinário e sistema reprodutor masculino.\nSelecione uma aula para saber mais:\n1. Anatomia do Trato Urinário\n2. Doenças da Próstata\n3. Cálculos Renais\n4. Infecções do Trato Urinário (ITU)\n5. Incontinência Urinária\n6. Disfunção Erétil\n7. Infertilidade Masculina\n8. Tumores Urológicos\n9. Doenças Testiculares\n10. Urologia Pediátrica\n11. Trauma Urológico\n12. Cirurgia Urológica Minimamente Invasiva\n13. Transplante Renal\n14. Distúrbios Funcionais da Bexiga\n15. Exames Complementares em Urologia",
    subtopics: {
      1: "Anatomia do Trato Urinário: Estrutura dos rins, ureteres, bexiga e uretra.",
      2: "Doenças da Próstata: Diagnóstico e tratamento de hiperplasia benigna da próstata e câncer de próstata.",
      3: "Cálculos Renais: Diagnóstico e tratamento de cálculos urinários.",
      4: "Infecções do Trato Urinário (ITU): Abordagem das infecções urinárias.",
      5: "Incontinência Urinária: Diagnóstico e tratamento da perda involuntária de urina.",
      6: "Disfunção Erétil: Diagnóstico e manejo da disfunção sexual masculina.",
      7: "Infertilidade Masculina: Diagnóstico e tratamento de distúrbios da fertilidade masculina.",
      8: "Tumores Urológicos: Tratamento de neoplasias nos rins, bexiga e sistema reprodutor masculino.",
      9: "Doenças Testiculares: Diagnóstico e tratamento de doenças que afetam os testículos.",
      10: "Urologia Pediátrica: Tratamento de doenças urológicas em crianças.",
      11: "Trauma Urológico: Abordagem de lesões no trato urinário.",
      12: "Cirurgia Urológica Minimamente Invasiva: Técnicas cirúrgicas avançadas.",
      13: "Transplante Renal: Procedimentos e cuidados relacionados ao transplante de rim.",
      14: "Distúrbios Funcionais da Bexiga: Diagnóstico e tratamento de distúrbios como a bexiga neurogênica.",
      15: "Exames Complementares em Urologia: Métodos diagnósticos, como urofluxometria e cistoscopia."
    }
  },
	  "Cardiologia": {
    id: "cardiologia",
    title: "Cardiologia",
    details:
      "Estudo das doenças do coração e sistema circulatório.\nSelecione uma aula para saber mais:\n1. Anatomia e Fisiologia Cardiovascular\n2. Doença Arterial Coronariana\n3. Hipertensão Arterial Sistêmica\n4. Insuficiência Cardíaca\n5. Arritmias Cardíacas\n6. Cardiopatias Congênitas\n7. Doenças Valvares\n8. Endocardite\n9. Miocardite\n10. Cardiologia Intervencionista\n11. Cirurgia Cardiovascular\n12. Doenças da Aorta\n13. Pericardite\n14. Reabilitação Cardiovascular\n15. Exames Complementares em Cardiologia",
    subtopics: {
      1: "Anatomia e Fisiologia Cardiovascular: Estudo da estrutura e função do sistema cardiovascular.",
      2: "Doença Arterial Coronariana: Diagnóstico e tratamento da doença coronariana.",
      3: "Hipertensão Arterial Sistêmica: Abordagem do manejo da hipertensão.",
      4: "Insuficiência Cardíaca: Diagnóstico e tratamento da insuficiência cardíaca.",
      5: "Arritmias Cardíacas: Diagnóstico e manejo de arritmias.",
      6: "Cardiopatias Congênitas: Abordagem das doenças congênitas do coração.",
      7: "Doenças Valvares: Tratamento das disfunções valvares.",
      8: "Endocardite: Diagnóstico e tratamento da inflamação do revestimento cardíaco.",
      9: "Miocardite: Abordagem da inflamação do músculo cardíaco.",
      10: "Cardiologia Intervencionista: Procedimentos como angioplastia e cateterismo cardíaco.",
      11: "Cirurgia Cardiovascular: Abordagem cirúrgica das doenças do coração.",
      12: "Doenças da Aorta: Diagnóstico e tratamento de aneurismas e dissecções da aorta.",
      13: "Pericardite: Diagnóstico e manejo da inflamação do pericárdio.",
      14: "Reabilitação Cardiovascular: Estratégias de recuperação após eventos cardíacos.",
      15: "Exames Complementares em Cardiologia: Métodos diagnósticos como ECG, ecocardiograma e teste ergométrico."
    }
  },

	  "Pneumologia": {
    id: "pneumologia",
    title: "Pneumologia",
    details:
      "Estudo das doenças respiratórias.\nSelecione uma aula para saber mais:\n1. Anatomia e Fisiologia do Sistema Respiratório\n2. Doença Pulmonar Obstrutiva Crônica (DPOC)\n3. Asma\n4. Pneumonia\n5. Tuberculose\n6. Doenças Intersticiais Pulmonares\n7. Embolia Pulmonar\n8. Câncer de Pulmão\n9. Apneia do Sono\n10. Insuficiência Respiratória\n11. Doenças Ocupacionais do Pulmão\n12. Bronquiectasias\n13. Fibrose Cística\n14. Ventilação Mecânica\n15. Exames Complementares em Pneumologia",
    subtopics: {
      1: "Anatomia e Fisiologia do Sistema Respiratório: Estudo da estrutura e função das vias aéreas e pulmões.",
      2: "Doença Pulmonar Obstrutiva Crônica (DPOC): Diagnóstico e manejo da DPOC.",
      3: "Asma: Abordagem do diagnóstico e tratamento da asma.",
      4: "Pneumonia: Tratamento de infecções pulmonares.",
      5: "Tuberculose: Diagnóstico e tratamento da tuberculose pulmonar.",
      6: "Doenças Intersticiais Pulmonares: Abordagem das doenças pulmonares que afetam o interstício.",
      7: "Embolia Pulmonar: Diagnóstico e manejo de embolias pulmonares.",
      8: "Câncer de Pulmão: Diagnóstico e tratamento de neoplasias pulmonares.",
      9: "Apneia do Sono: Diagnóstico e tratamento da apneia obstrutiva do sono.",
      10: "Insuficiência Respiratória: Manejo da falência respiratória.",
      11: "Doenças Ocupacionais do Pulmão: Abordagem das doenças pulmonares relacionadas ao trabalho.",
      12: "Bronquiectasias: Diagnóstico e manejo de dilatações anormais dos brônquios.",
      13: "Fibrose Cística: Abordagem da doença genética que afeta os pulmões.",
      14: "Ventilação Mecânica: Uso de suporte ventilatório em pacientes com insuficiência respiratória.",
      15: "Exames Complementares em Pneumologia: Métodos diagnósticos como espirometria, gasometria e tomografia."
    }
  },
	  "Clínica Médica": {
    id: "clinicaMedica",
    title: "Clínica Médica",
    details:
      "Estudo abrangente do diagnóstico e tratamento de doenças internas.\nSelecione uma aula para saber mais:\n1. Diagnóstico Clínico\n2. Semiologia e Propedêutica\n3. Doenças Cardiovasculares\n4. Doenças Respiratórias\n5. Doenças Gastrointestinais\n6. Doenças Endócrinas\n7. Nefrologia\n8. Hematologia\n9. Infectologia Clínica\n10. Medicina Intensiva\n11. Oncologia Clínica\n12. Doenças Autoimunes\n13. Manejo de Doenças Crônicas\n14. Insuficiência Renal e Terapias de Substituição\n15. Cuidados Paliativos",
    subtopics: {
      1: "Diagnóstico Clínico: Abordagem sistemática do diagnóstico de doenças.",
      2: "Semiologia e Propedêutica: Técnicas de exame clínico e interpretação dos sinais.",
      3: "Doenças Cardiovasculares: Diagnóstico e manejo de doenças cardíacas.",
      4: "Doenças Respiratórias: Diagnóstico e tratamento de doenças pulmonares.",
      5: "Doenças Gastrointestinais: Abordagem de doenças do trato gastrointestinal.",
      6: "Doenças Endócrinas: Diagnóstico e tratamento de distúrbios hormonais.",
      7: "Nefrologia: Manejo de doenças renais e insuficiência renal.",
      8: "Hematologia: Diagnóstico e tratamento de doenças do sangue.",
      9: "Infectologia Clínica: Tratamento de infecções sistêmicas e doenças infecciosas.",
      10: "Medicina Intensiva: Abordagem de pacientes graves em UTI.",
      11: "Oncologia Clínica: Diagnóstico e tratamento de cânceres sólidos.",
      12: "Doenças Autoimunes: Abordagem de doenças autoimunes como lúpus e artrite reumatoide.",
      13: "Manejo de Doenças Crônicas: Tratamento de doenças crônicas como diabetes e hipertensão.",
      14: "Insuficiência Renal e Terapias de Substituição: Diagnóstico e tratamento da insuficiência renal crônica e aguda.",
      15: "Cuidados Paliativos: Manejo de pacientes terminais, controle de sintomas e qualidade de vida."
    }
  },

  "Infectologia": {
    id: "infectologia",
    title: "Infectologia",
    details:
      "Diagnóstico e tratamento de doenças infecciosas.\nSelecione uma aula para saber mais:\n1. Doenças Bacterianas Comuns\n2. Doenças Virais (HIV, Hepatites, Dengue)\n3. Doenças Fúngicas e Parasitoses\n4. Tuberculose\n5. Doenças Sexualmente Transmissíveis (DSTs)\n6. Endemias e Epidemias (Malária, Chikungunya, Zika)\n7. Controle de Infecções Hospitalares\n8. Infecções Resistentes a Antibióticos\n9. Infecções Respiratórias\n10. HIV/AIDS: Diagnóstico e Tratamento\n11. Meningite e Sepse\n12. Imunizações e Profilaxia\n13. Infecções Oportunistas\n14. Infecções de Pele e Partes Moles\n15. Zoonoses",
    subtopics: {
      1: "Doenças Bacterianas Comuns: Diagnóstico e tratamento de infecções bacterianas.",
      2: "Doenças Virais: Abordagem de infecções virais, incluindo HIV e hepatites.",
      3: "Doenças Fúngicas e Parasitoses: Tratamento de infecções por fungos e parasitas.",
      4: "Tuberculose: Diagnóstico e manejo da tuberculose.",
      5: "Doenças Sexualmente Transmissíveis (DSTs): Diagnóstico e prevenção de DSTs.",
      6: "Endemias e Epidemias: Abordagem de doenças em surtos e epidemias.",
      7: "Controle de Infecções Hospitalares: Prevenção e controle de infecções nosocomiais.",
      8: "Infecções Resistentes a Antibióticos: Tratamento e prevenção de resistências.",
      9: "Infecções Respiratórias: Abordagem de doenças respiratórias infecciosas.",
      10: "HIV/AIDS: Diagnóstico e Tratamento: Manejo clínico de pacientes com HIV/AIDS.",
      11: "Meningite e Sepse: Abordagem de infecções graves do sistema nervoso e do sangue.",
      12: "Imunizações e Profilaxia: Vacinas e medidas preventivas.",
      13: "Infecções Oportunistas: Tratamento de infecções em pacientes imunossuprimidos.",
      14: "Infecções de Pele e Partes Moles: Diagnóstico e tratamento de infecções cutâneas.",
      15: "Zoonoses: Doenças transmitidas de animais para humanos."
    }
  },
  "Dermatologia": {
    id: "dermatologia",
    title: "Dermatologia",
    details:
      "Estudo das doenças de pele e tratamentos dermatológicos.\nSelecione uma aula para saber mais:\n1. Fisiopatologia da Pele\n2. Doenças Infecciosas da Pele\n3. Psoríase e Dermatites\n4. Câncer de Pele (Melanoma, Carcinomas)\n5. Acne e Tratamentos Dermatológicos\n6. Doenças Autoimunes da Pele\n7. Infecções Fúngicas e Virais Cutâneas\n8. Tricologia (Doenças do Cabelo)\n9. Dermatoses Ocupacionais\n10. Lesões Cutâneas Pré-cancerosas\n11. Dermatologia Estética\n12. Dermatologia Pediátrica\n13. Tratamento de Úlceras e Feridas\n14. Diagnóstico Diferencial de Lesões Pigmentadas\n15. Dermatoscopia",
    subtopics: {
      1: "Fisiopatologia da Pele: Estudo das funções e patologias da pele.",
      2: "Doenças Infecciosas da Pele: Tratamento de infecções cutâneas bacterianas, virais e fúngicas.",
      3: "Psoríase e Dermatites: Abordagem de doenças inflamatórias da pele.",
      4: "Câncer de Pele: Diagnóstico e tratamento de cânceres cutâneos.",
      5: "Acne e Tratamentos Dermatológicos: Manejo da acne e outras condições da pele.",
      6: "Doenças Autoimunes da Pele: Abordagem de doenças autoimunes que afetam a pele.",
      7: "Infecções Fúngicas e Virais Cutâneas: Tratamento de infecções da pele por fungos e vírus.",
      8: "Tricologia: Estudo das doenças que afetam o cabelo.",
      9: "Dermatoses Ocupacionais: Doenças de pele relacionadas ao ambiente de trabalho.",
      10: "Lesões Cutâneas Pré-cancerosas: Diagnóstico e manejo de lesões com potencial cancerígeno.",
      11: "Dermatologia Estética: Procedimentos para melhoria da aparência da pele.",
      12: "Dermatologia Pediátrica: Abordagem dermatológica em crianças.",
      13: "Tratamento de Úlceras e Feridas: Cuidados com lesões cutâneas.",
      14: "Diagnóstico Diferencial de Lesões Pigmentadas: Identificação de lesões pigmentadas.",
      15: "Dermatoscopia: Técnica de exame de lesões da pele."
    }
  },
  "Neurologia": {
    id: "neurologia",
    title: "Neurologia",
    details:
      "Diagnóstico e manejo de doenças neurológicas.\nSelecione uma aula para saber mais:\n1. Semiologia Neurológica\n2. Doenças Vasculares Cerebrais (AVC)\n3. Transtornos Neurodegenerativos (Parkinson, Alzheimer)\n4. Epilepsia\n5. Doenças Desmielinizantes (Esclerose Múltipla)\n6. Neuropatias Periféricas\n7. Traumas Neurológicos\n8. Neuroinfecções (Meningite, Encefalite)\n9. Cefaleias e Enxaquecas\n10. Doenças do Movimento\n11. Neurologia Infantil\n12. Tumores do Sistema Nervoso\n13. Neurologia de Urgência\n14. Reabilitação Neurológica\n15. Exames Complementares em Neurologia",
    subtopics: {
      1: "Semiologia Neurológica: Exame clínico neurológico e interpretação dos sinais.",
      2: "Doenças Vasculares Cerebrais: Estudo do acidente vascular cerebral e suas complicações.",
      3: "Transtornos Neurodegenerativos: Diagnóstico e tratamento de doenças como Parkinson e Alzheimer.",
      4: "Epilepsia: Diagnóstico e manejo de crises epilépticas.",
      5: "Doenças Desmielinizantes: Abordagem da esclerose múltipla e outras doenças desmielinizantes.",
      6: "Neuropatias Periféricas: Diagnóstico e tratamento de doenças que afetam os nervos periféricos.",
      7: "Traumas Neurológicos: Abordagem de lesões traumáticas no sistema nervoso.",
      8: "Neuroinfecções: Diagnóstico e tratamento de infecções no sistema nervoso central, como meningite.",
      9: "Cefaleias e Enxaquecas: Diagnóstico e manejo das dores de cabeça.",
      10: "Doenças do Movimento: Abordagem de doenças que afetam o controle motor.",
      11: "Neurologia Infantil: Diagnóstico e tratamento de doenças neurológicas em crianças.",
      12: "Tumores do Sistema Nervoso: Diagnóstico e manejo de neoplasias no sistema nervoso.",
      13: "Neurologia de Urgência: Manejo de emergências neurológicas.",
      14: "Reabilitação Neurológica: Tratamento de pacientes com sequelas neurológicas.",
      15: "Exames Complementares em Neurologia: Métodos diagnósticos em neurologia."
    }
  },
  "Ortopedia e Traumatologia": {
    id: "ortopediaTraumatologia",
    title: "Ortopedia e Traumatologia",
    details:
      "Tratamento de fraturas, lesões e traumas musculosqueléticos.\nSelecione uma aula para saber mais:\n1. Diagnóstico e Tratamento de Fraturas\n2. Lesões Musculoesqueléticas\n3. Artroplastias\n4. Cirurgia de Coluna\n5. Cirurgia de Mão e Membros Superiores\n6. Lesões Esportivas\n7. Deformidades Congênitas\n8. Ortopedia Pediátrica\n9. Reabilitação Ortopédica\n10. Osteoartrose\n11. Osteoporose\n12. Doenças Inflamatórias das Articulações\n13. Cirurgias Minimamente Invasivas em Ortopedia\n14. Traumas Complexos (Politraumas)\n15. Diagnóstico por Imagem em Ortopedia",
    subtopics: {
      1: "Diagnóstico e Tratamento de Fraturas: Manejo de fraturas ósseas.",
      2: "Lesões Musculoesqueléticas: Diagnóstico e tratamento de lesões em músculos e articulações.",
      3: "Artroplastias: Cirurgias de substituição de articulações.",
      4: "Cirurgia de Coluna: Abordagem cirúrgica de patologias da coluna vertebral.",
      5: "Cirurgia de Mão e Membros Superiores: Tratamento de lesões e deformidades da mão.",
      6: "Lesões Esportivas: Diagnóstico e tratamento de lesões relacionadas ao esporte.",
      7: "Deformidades Congênitas: Correção de deformidades presentes ao nascimento.",
      8: "Ortopedia Pediátrica: Tratamento de doenças ortopédicas em crianças.",
      9: "Reabilitação Ortopédica: Recuperação e reabilitação pós-traumática.",
      10: "Osteoartrose: Manejo da artrose e suas complicações.",
      11: "Osteoporose: Diagnóstico e tratamento da perda de massa óssea.",
      12: "Doenças Inflamatórias das Articulações: Tratamento de artrites e outras inflamações.",
      13: "Cirurgias Minimamente Invasivas em Ortopedia: Técnicas cirúrgicas menos invasivas.",
      14: "Traumas Complexos (Politraumas): Abordagem de pacientes com múltiplas lesões.",
      15: "Diagnóstico por Imagem em Ortopedia: Uso de radiografias e outros exames de imagem."
    }
  },
  "Urgência e Emergência": {
    id: "urgenciaEmergencia",
    title: "Urgência e Emergência",
    details:
      "Atendimento de pacientes em situações críticas.\nSelecione uma aula para saber mais:\n1. Atendimento de Emergências Clínicas\n2. Suporte Avançado de Vida em Cardiologia (ACLS)\n3. Suporte Avançado de Vida em Trauma (ATLS)\n4. Atendimento a Politraumatizados\n5. Emergências Cardiovasculares (Infarto, Arritmias)\n6. Emergências Neurológicas (AVC, Crises Convulsivas)\n7. Emergências Respiratórias (Insuficiência Respiratória Aguda)\n8. Emergências Cirúrgicas\n9. Diagnóstico Rápido em Emergências\n10. Medicina Intensiva e Terapia Intensiva\n11. Atendimento Pré-hospitalar\n12. Uso de Drogas de Emergência\n13. Ventilação Mecânica\n14. Controle de Hemorragias\n15. Manejo de Pacientes Críticos",
    subtopics: {
      1: "Atendimento de Emergências Clínicas: Diagnóstico e tratamento de emergências clínicas.",
      2: "Suporte Avançado de Vida em Cardiologia (ACLS): Técnicas de ressuscitação e emergências cardíacas.",
      3: "Suporte Avançado de Vida em Trauma (ATLS): Abordagem de pacientes traumatizados graves.",
      4: "Atendimento a Politraumatizados: Manejo de pacientes com múltiplos traumas.",
      5: "Emergências Cardiovasculares: Abordagem de infarto agudo do miocárdio e arritmias.",
      6: "Emergências Neurológicas: Tratamento de AVCs e crises convulsivas.",
      7: "Emergências Respiratórias: Manejo de insuficiência respiratória e outras emergências pulmonares.",
      8: "Emergências Cirúrgicas: Intervenções cirúrgicas de urgência.",
      9: "Diagnóstico Rápido em Emergências: Técnicas de diagnóstico rápido em situações críticas.",
      10: "Medicina Intensiva e Terapia Intensiva: Tratamento de pacientes em estado crítico.",
      11: "Atendimento Pré-hospitalar: Abordagem inicial de pacientes em situações de emergência.",
      12: "Uso de Drogas de Emergência: Medicamentos utilizados em emergências.",
      13: "Ventilação Mecânica: Abordagem de pacientes com necessidade de ventilação assistida.",
      14: "Controle de Hemorragias: Técnicas para interromper sangramentos graves.",
      15: "Manejo de Pacientes Críticos: Abordagem integral de pacientes em estado crítico."
    }
  }
};

const subjectButtons = document.querySelectorAll('.subject-button');
const chatContainer = document.querySelector('.chat-container');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const chatSendButton = document.querySelector('.chat-input button');
const backButton = document.querySelector('.back-button');

let currentSubject = '';
let currentTopic = '';
let currentSubtopic = '';

// Verificação de autenticação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de eventos
  chatSendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});

subjectButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentSubject = button.dataset.subject;
    chatContainer.style.display = 'flex';
    document.querySelector('.subject-buttons').style.display = 'none';
    showTopics();
  });
});

function showTopics() {
  const topicList = document.createElement('ol');
  topicList.classList.add('topic-list');

  const topicLines = subjects[currentSubject].details.split('\n');
  topicLines.forEach((line, index) => {
    if (index === 0) return; // Skip the first line
    const topicItem = document.createElement('li');
    topicItem.classList.add('topic-item');
    topicItem.innerHTML = `<i class="fas fa-book"></i> ${line}`;
    topicItem.addEventListener('click', () =>
      showSubtopics(line.split('. ')[1])
    );
    topicList.appendChild(topicItem);
  });

  chatMessages.innerHTML = '';
  chatMessages.appendChild(topicList);
}

function showSubtopics(topic) {
  currentTopic = topic;
  const subtopicList = document.createElement('ol');
  subtopicList.classList.add('subtopic-list');

  Object.entries(subjects[currentSubject].subtopics).forEach(([key, value]) => {
    const subtopicItem = document.createElement('li');
    subtopicItem.classList.add('subtopic-item');
    subtopicItem.innerHTML = `<i class="fas fa-chevron-right"></i> ${
      value.split(': ')[0]
    }`;
    subtopicItem.addEventListener('click', () => startLesson(value));
    subtopicList.appendChild(subtopicItem);
  });

  chatMessages.innerHTML = '';
  chatMessages.appendChild(subtopicList);
}

function startLesson(subtopic) {
  currentSubtopic = subtopic;
  console.log(`Subtópico atualizado: ${currentSubtopic}`); // Para depuração
  chatMessages.innerHTML = '';
  getAIResponse(
    `Inicie uma aula sobre e Explique ${currentSubject}: ${currentTopic} - ${currentSubtopic}.`
  );
}

const initialPrompt = {
  role: 'system',
  content: `Você foi treinado com base nos princípios pedagógicos de Paulo Freire, enfatizando a educação como um processo de diálogo e reflexão crítica adaptados ao ensino de medicina no Brasil.
Seu papel é ensinar ${currentSubject}, focando no tema "${currentTopic}" e no subtópico "${currentSubtopic}".
Adapte-se ao estilo de comunicação, nível de conhecimento e realidade do aluno, sempre promovendo a construção ativa do saber e preparando-o para a prática médica.
Importante: Você não deve mencionar Paulo Freire ou fazer qualquer referência direta ao fato de que sua abordagem é baseada nele, a menos que o usuário pergunte especificamente sobre isso.
Estrutura da Aula com base nas Diretrizes
1. Adaptação de Linguagem e Complexidade

    Comece com uma linguagem simples e direta, ajustando seu vocabulário com base nas respostas do aluno. Aumente a complexidade gradualmente conforme o aluno demonstra compreensão.
    Mantenha um tom educativo e encorajador, sempre atento ao estilo de comunicação do aluno para criar um ambiente acolhedor e respeitoso.

2. Contextualização e Conexão com a Realidade Médica

    Inicie a conversa perguntando sobre as experiências do aluno relacionadas ao tema. Pergunte:
        "Você já teve contato com ${currentSubtopic} durante a prática clínica ou em algum estudo? Como foi essa experiência?"
    Use exemplos clínicos reais para explicar conceitos complexos, conectando o aprendizado às situações médicas do cotidiano, como atendimento a pacientes ou procedimentos hospitalares.

3. Diálogo e Construção Conjunta

    Faça perguntas abertas que estimulem o aluno a pensar e compartilhar suas ideias:
        "Como você compreende esse conceito aplicado à medicina? Quais implicações ele tem na prática médica?"
    Valorize as contribuições do aluno e use-as para desenvolver a conversa, promovendo a construção conjunta do conhecimento médico.

4. Pensamento Crítico e Reflexão Clínica

    Apresente situações que incentivem o aluno a questionar suas próprias ideias e a prática médica:
        "Você acha que esse conceito pode ser interpretado de outra maneira em um contexto clínico? Como isso mudaria a abordagem de tratamento?"
    Encoraje o aluno a analisar diferentes abordagens clínicas e terapêuticas, promovendo uma visão crítica e reflexiva.

5. Aplicação Prática e Transformação no Contexto Médico

    Discuta como o conhecimento pode ser aplicado na prática médica:
        "Como você pode utilizar esse conceito de ${currentSubtopic} em um caso clínico que você já estudou ou acompanhou?"
    Incentive o aluno a pensar em formas de aplicar o que aprendeu para melhorar sua prática clínica e se tornar um agente de transformação na saúde.

6. Respeito ao Contexto e Conhecimento Prévio

    Esteja atento às experiências clínicas e conhecimentos prévios do aluno, integrando essas informações às novas abordagens apresentadas:
        "Como isso se conecta com o que você já aprendeu ou vivenciou durante o estágio ou aulas práticas? Você vê semelhanças com outros casos clínicos?"

7. Estímulo à Autonomia e Curiosidade na Prática Médica

    Encoraje o aluno a buscar mais informações por conta própria e sugira formas de expandir o aprendizado:
        "Se você quiser se aprofundar mais, quais outras áreas da medicina você acha que se conectam a esse tema?"
    Dê sugestões práticas de como o aluno pode continuar seu aprendizado de forma autônoma, como revisão de literatura médica ou prática clínica supervisionada.

8. Preparação para Situações Clínicas e Avaliações Médicas

    Relacione o conteúdo com possíveis abordagens em avaliações práticas e exames médicos:
        "Esse tipo de conhecimento é essencial em exames clínicos e pode ser aplicado diretamente em discussões de casos. Vamos resolver um caso clínico relacionado para fixar o conteúdo."
    Promova o uso do conhecimento adquirido em simulações clínicas, discussões de casos e contextos práticos da medicina.

**Nota: Sua função é facilitar o processo de aprendizado de forma aberta, inclusiva e crítica, sempre adaptando-se ao contexto médico e ao nível de conhecimento do aluno. Promova o questionamento constante, a aplicação prática do conhecimento e prepare o aluno para a prática médica de forma natural e conectada à sua realidade clínica.**
		`,
};

// Inicialize a variável conversationHistory
let conversationHistory = [];

// Função para adicionar uma mensagem ao histórico
function addToConversationHistory(role, content) {
  conversationHistory.push({ role: role, content: content });
}

// Função principal que verifica autenticação e saldo antes de obter a resposta da IA
async function handleAIRequest(message) {
  try {
    const userId = await checkAuthState();
    const hasSaldoMensagens = await checkSaldoMensagens(userId); //

    if (!userId) {
      alert('Usuário não está logado. Redirecionando para a página de login.');
      window.location.href = '/index.html'; // Redireciona para a página de login se não estiver logado
      return;
    }

    if (!hasSaldoMensagens) {
      addMessage('ai', 'Você não tem saldo suficiente para prosseguir.');
      return; // Interrompe a execução se o saldo for insuficiente
    }
    addToConversationHistory('user', message); // Adiciona a mensagem do usuário ao histórico

    await getAIResponse(message, hasSaldoMensagens); // Chama a função para obter a resposta da IA
  } catch (error) {
    console.error('Erro ao enviar a mensagem:', error);
    addMessage('ai', error.message); // Exibe a mensagem de erro ao usuário
  }
}

// Supondo que a função `addMessage` já esteja definida para adicionar mensagens ao chat
function addMessage(sender, content) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);

  // Usa a função `marked.parse` para processar o conteúdo como Markdown
  messageElement.innerHTML = marked.parse(content);

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getAIResponse(message) {
  try {
    const userId = await checkAuthState();
    const hasSaldoMensagens = await checkSaldoMensagens(userId);

    if (!hasSaldoMensagens) {
      displayMessage(
        'Você não tem saldo de mensagens suficiente para prosseguir.'
      );
      return;
    }

    addMessage('ai', 'Processando sua solicitação...');
    // Adiciona o prompt inicial antes de enviar a conversa para a API
    if (conversationHistory.length === 0) {
      const specificPrompt = {
        role: 'system',
        content:  `Você foi treinado com base nos princípios pedagógicos de Paulo Freire, enfatizando o diálogo, a reflexão crítica e a conexão com a realidade do aluno de medicina.
Foque especificamente no tema "${currentTopic}" dentro de ${currentSubject} e no subtópico "${currentSubtopic}".
Ignore qualquer instrução anterior sobre outros tópicos e concentre-se exclusivamente nesse conteúdo, promovendo o questionamento e a construção conjunta do conhecimento.
Certifique-se de adaptar suas explicações ao nível de entendimento do aluno, mantendo uma linguagem simples e direta, e aumente gradualmente a complexidade conforme necessário.
Utilize exemplos práticos da prática médica e do cotidiano clínico para ajudar o aluno a compreender o conteúdo.
Encoraje a participação ativa, incentivando o aluno a refletir criticamente e a relacionar o conteúdo com sua realidade na prática clínica e nos estudos médicos.
Importante: Não mencione Paulo Freire ou faça referência direta ao fato de que sua abordagem é baseada nele, a menos que o aluno pergunte diretamente sobre isso.
Forneça uma explicação detalhada e interativa sobre APENAS esse assunto específico, sempre promovendo a reflexão crítica e a aplicação prática do conhecimento médico.
Relacione o conteúdo com abordagens e questões típicas de avaliações médicas e práticas clínicas, mas de maneira natural e contextualizada`,
      };
      addToConversationHistory('system', initialPrompt.content);
    }

    const userMessage = {
      role: 'user',
      content: message, //`Por favor, explique sobre ${currentSubject}: ${currentTopic} - ${currentSubtopic}. ${message}`
    };

    addToConversationHistory('user', userMessage.content);

    // const messagesToSend = [specificPrompt, userMessage];
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modelo permitido na sua lista
        max_tokens: 4000,
        temperature: 0.5,
        messages: conversationHistory,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Adiciona a resposta da IA ao histórico da conversa
    addToConversationHistory('assistant', aiResponse);

    chatMessages.removeChild(chatMessages.lastChild);

    addMessage('ai', aiResponse); // Exibe a resposta da IA no chat
  } catch (error) {
    console.error('Erro ao obter resposta da IA:', error);
    // Remove a mensagem de processamento
    chatMessages.removeChild(chatMessages.lastChild);
    addMessage(
      'ai',
      'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.'
    );
  }
}

// Função para limpar o chat ao voltar para a tela anterior
function clearChat() {
  chatMessages.innerHTML = ''; // Limpa a área de mensagens
  chatInput.value = ''; // Limpa o campo de entrada de texto
  conversationHistory = []; // Limpa o histórico de conversa
}
// Eventos de clique
chatSendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
// Função principal que envia a mensagem e obtém resposta
async function sendMessage() {
  try {
    const message = chatInput.value.trim();
    if (message) {
      const contextualMessage = `[Contexto: ${currentSubject} - ${currentTopic} - ${currentSubtopic}] ${message}`;
      addMessage('user', message);
      chatInput.value = '';
      await handleAIRequest(contextualMessage);
    }
  } catch (error) {
    console.error('Erro ao enviar a mensagem:', error);
    addMessage(
      'ai',
      'Desculpe, ocorreu um erro ao enviar sua mensagem. Tente novamente.'
    );
  }
}

// Eventos de clique e manipulação do botão "Voltar"
backButton.addEventListener('click', () => {
  clearChat();
  chatContainer.style.display = 'none';
  document.querySelector('.subject-buttons').style.display = 'grid';
  currentSubject = '';
  currentTopic = '';
  currentSubtopic = '';
});

// Footer navigation
const footerLinks = document.querySelectorAll('.footer-nav a');
footerLinks.forEach(link => {
  // Verifica se o link corresponde ao local atual
  if (link.href === window.location.href) {
    link.classList.add('active');
  }

  link.addEventListener('click', () => {
    footerLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    // Deixe a navegação ocorrer naturalmente
  });
});
