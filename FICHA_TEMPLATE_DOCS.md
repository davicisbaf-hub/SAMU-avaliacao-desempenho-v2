# Documentação: FichaAvaliacaoTemplate

## Visão Geral

O componente `FichaAvaliacaoTemplate` é um componente reutilizável que renderiza fichas de avaliação com a **mesma estrutura visual** do formulário original, porém com suporte a modo **leitura (readOnly)**.

## Características

✅ Modo edição (preenchimento de avaliação)  
✅ Modo leitura (visualização de avaliação preenchida)  
✅ Impressão/Download PDF via React-to-Print  
✅ Suporte a múltiplos tipos de avaliação (Médico, Condutor, etc.)  
✅ Escala Likert colorida  
✅ Campos de observações  
✅ Assinaturas (ocultas em modo leitura)  

## Uso Básico

### Modo Edição (como na FichaAvaliacaoMedico original)

```tsx
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
  selecionarNota={selecionarNota}
  tentouEnviar={tentouEnviar}
  readOnly={false}  // ← EDIÇÃO
/>
```

### Modo Leitura (como em BaixarFicha)

```tsx
<FichaAvaliacaoTemplate
  tipoAvaliacao={avaliacao.tipo_avaliacao}
  criterios={criterios}
  notas={avaliacao.resultado}  // Usa dados salvos
  escalaLikert={escalaLikert}
  pesos={pesos}
  bases={bases}
  observacoes={avaliacao.observacoes_gerais || ""}
  pontosMelhorar={avaliacao.pontos_melhorar || ""}
  planoAcao={avaliacao.plano_acao || ""}
  userName={avaliacao.avaliado_nome}
  userBase={avaliacao.base}
  readOnly={true}  // ← LEITURA
/>
```

## Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|------------|-----------|
| `tipoAvaliacao` | string | ✅ | Tipo da avaliação (ex: "Médico", "BP-TEAM") |
| `criterios` | Criterios[] | ✅ | Array de critérios de avaliação |
| `notas` | Record<string, number> | ✅ | Objeto com respostas (chave=criterio, valor=nota) |
| `escalaLikert` | EscalaLikert[] | ✅ | Array com configuração da escala 1-5 |
| `pesos` | Peso[] | ✅ | Array com definição dos pesos |
| `bases` | Base[] | ✅ | Array de bases de lotação |
| `observacoes` | string | ✅ | Observações gerais |
| `pontosMelhorar` | string | ✅ | Pontos a melhorar |
| `planoAcao` | string | ✅ | Plano de ação |
| `userName` | string | ❌ | Nome do avaliado |
| `userBase` | string | ❌ | Base de lotação do avaliado |
| `selecionarNota` | function | ❌ | Callback ao selecionar nota (ignorado se readOnly) |
| `tentouEnviar` | boolean | ❌ | Flag para destacar erros de validação |
| `readOnly` | boolean | ❌ | Se true, desabilita edição (padrão: false) |
| `onPrint` | function | ❌ | Callback ao terminar impressão |

## Tipos de Dados

```tsx
type Criterios = {
  categoria: string;
  codigo: string;
  criterio: string;
  peso: number;
  id: number;
  indicador: string;
  titulo: string;
};

type EscalaLikert = {
  nota: number;
  titulo: string;
  descricao: string;
  cor: string;
};

type Peso = {
  valor: number;
  descricao: string;
  cor: string;
};

type Base = {
  id: number;
  nome: string;
  cor: string;
};
```

## Estrutura de Dados do Resultado

O objeto `notas` (em edição) ou `avaliacao.resultado` (em leitura) deve ter a seguinte estrutura:

```tsx
{
  "Nome do Critério": { nota: 1, peso: 1 },
  "Outro Critério": { nota: 5, peso: 1 },
  ...
}
```

**Chaves**: String que coincide com `criterio.criterio` do array `criterios`  
**Valor**: Objeto com `nota` (1-5) e `peso` (número)

## Integração com BaixarFicha

O componente está já integrado em `src/Pages/BaixarFicha.tsx`:

1. Clique em "Visualizar" em uma avaliação
2. O sistema carrega os critérios da API
3. Modal renderiza FichaAvaliacaoTemplate com `readOnly={true}`
4. Usuário pode imprimir/baixar a ficha

## Customização Futura

O componente pode ser estendido para:
- Exportar como PDF programaticamente (jsPDF)
- Comparação lado-a-lado de avaliações
- Modo "diferenças" (mostrar alterações)
- Templates customizados por tipo de avaliação

---

**Arquivo do componente**: `src/components/FichaAvaliacaoTemplate.tsx`  
**Uso atual**: `src/Pages/BaixarFicha.tsx`
