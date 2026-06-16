// EXEMPLO DE USO - FichaAvaliacaoTemplate

// ============================================
// 1. IMPORTAR O COMPONENTE
// ============================================
import FichaAvaliacaoTemplate from '../components/FichaAvaliacaoTemplate';

// ============================================
// 2. MODO EDIÇÃO - PREENCHER AVALIAÇÃO
// ============================================
export function ModoEdicao() {
  const [criterios, setCriterios] = useState([]);
  const [notas, setNotas] = useState({});
  const [observacoes, setObservacoes] = useState("");
  
  return (
    <FichaAvaliacaoTemplate
      tipoAvaliacao="Médico"
      criterios={criterios}
      notas={notas}
      escalaLikert={escalaLikert}
      pesos={pesos}
      bases={bases}
      observacoes={observacoes}
      pontosMelhorar={pontosMelhorar}
      planoAcao={planoAcao}
      userName={user?.nome}
      userBase={user?.base}
      selecionarNota={(codigo, nota) => {
        setNotas(prev => ({ ...prev, [codigo]: nota }));
      }}
      tentouEnviar={tentouEnviar}
      readOnly={false}  // ← EDIÇÃO ATIVA
    />
  );
}

// ============================================
// 3. MODO LEITURA - VISUALIZAR AVALIAÇÃO
// ============================================
export function ModoLeitura({ avaliacao }) {
  const [criterios, setCriterios] = useState([]);
  
  useEffect(() => {
    // Carrega os critérios conforme o tipo
    fetch(`/api/criterios-avaliacao-autoavaliacao/${avaliacao.tipo_avaliacao}`)
      .then(r => r.json())
      .then(setCriterios);
  }, [avaliacao.tipo_avaliacao]);

  return (
    <FichaAvaliacaoTemplate
      tipoAvaliacao={avaliacao.tipo_avaliacao}
      criterios={criterios}
      notas={avaliacao.resultado}  // ← USA DADOS SALVOS
      escalaLikert={escalaLikert}
      pesos={pesos}
      bases={bases}
      observacoes={avaliacao.observacoes_gerais || ""}
      pontosMelhorar={avaliacao.pontos_melhorar || ""}
      planoAcao={avaliacao.plano_acao || ""}
      userName={avaliacao.avaliado_nome}
      userBase={avaliacao.base}
      readOnly={true}  // ← LEITURA APENAS
      onPrint={() => console.log("Impressão concluída")}
    />
  );
}

// ============================================
// 4. DADOS DE EXEMPLO
// ============================================
const exemploAvaliacao = {
  id: 1,
  avaliado_nome: "Dr. João Silva",
  avaliado_funcao: "Médico",
  avaliador_nome: "Dr. Carlos Santos",
  avaliador_funcao: "Chefe",
  funcao: "Médico",
  tipo_avaliacao: "Médico",
  base: "Recife - Central",
  resultado: {
    "Conhecimento técnico": { nota: 5, peso: 1 },
    "Comunicação": { nota: 4, peso: 1 },
    "Liderança": { nota: 3, peso: 1 },
  },
  observacoes_gerais: "Profissional competente e dedicado",
  pontos_melhorar: "Melhorar comunicação com equipe",
  plano_acao: "Participar de curso de liderança",
  criado_em: "2024-06-16T20:00:00Z"
};

// ============================================
// 5. ESTRUTURA DO BANCO DE DADOS
// ============================================
/*
CREATE TABLE avaliacoes (
  id INTEGER PRIMARY KEY,
  avaliador_nome TEXT,
  avaliador_funcao TEXT,
  avaliado_nome TEXT,
  avaliado_funcao TEXT,
  funcao TEXT,
  tipo_avaliacao TEXT,
  base TEXT,
  resultado JSON,  // { "criterio": { nota: 1-5, peso: 1 } }
  observacoes_gerais TEXT,
  pontos_melhorar TEXT,
  plano_acao TEXT,
  criado_em DATETIME
);
*/

// ============================================
// 6. FLUXO EM BaixarFicha.tsx
// ============================================
/*
const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);
const [criterios, setCriterios] = useState([]);

// Quando usuário clica "Visualizar"
const handleViewClick = (avaliacao) => {
  setAvaliacaoSelecionada(avaliacao);
  
  // Carrega criterios conforme tipo
  fetch(`/api/criterios-avaliacao-autoavaliacao/${avaliacao.tipo_avaliacao}`)
    .then(r => r.json())
    .then(setCriterios);
};

// No modal/dialog
{avaliacaoSelecionada && criterios.length > 0 && (
  <FichaAvaliacaoTemplate
    tipoAvaliacao={avaliacaoSelecionada.tipo_avaliacao}
    criterios={criterios}
    notas={avaliacaoSelecionada.resultado}
    escalaLikert={escalaLikert}
    pesos={pesos}
    bases={bases}
    observacoes={avaliacaoSelecionada.observacoes_gerais || ""}
    pontosMelhorar={avaliacaoSelecionada.pontos_melhorar || ""}
    planoAcao={avaliacaoSelecionada.plano_acao || ""}
    userName={avaliacaoSelecionada.avaliado_nome}
    userBase={avaliacaoSelecionada.base}
    readOnly={true}
  />
)}
*/
