'use client';

import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Nav from '../components/Nav';
import { ChevronDown, Search, Mail, Phone, HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: 'Acesso e Autenticação',
    items: [
      {
        question: 'Como entro em contato com o suporte?',
        answer: 'Envie um e-mail para suporte@sistema.com.br ou ligue para (21) 99999-9999. Nosso time está disponível de segunda a sexta, das 9h às 17h.'
      },
      {
        question: 'Como redefinir minha senha?',
        answer: 'Clique em "Esqueci minha senha" na tela de login e siga as instruções. Você receberá um link de recuperação no seu e-mail.'
      },
      {
        question: 'O que fazer se esquecer o login?',
        answer: 'Entre em contato com o suporte ou RH para recuperar suas credenciais de acesso.'
      },
      {
        question: 'Posso acessar pelo celular?',
        answer: 'Sim, o sistema é totalmente responsivo e funciona em smartphones, tablets e desktops.'
      }
    ]
  },
  {
    category: 'Avaliações',
    items: [
      {
        question: 'Quem pode acessar o sistema?',
        answer: 'Apenas profissionais autorizados do SAMU 192 com credenciais válidas.'
      },
      {
        question: 'Como visualizar minhas avaliações?',
        answer: 'Apenas o adiministrador da sua base tem acesso as  avaliações. No menu lateral, clique em "Baixar Fichas" para ver todas as avaliações.'
      },
      {
        question: 'Como baixar as fichas de avaliação?',
        answer: 'No menu, clique em "Baixar Fichas" para obter os PDFs das suas avaliações.'
      },
      {
        question: 'Posso editar uma avaliação enviada?',
        answer: 'Não. Após o envio, a avaliação fica imutável para garantir a integridade dos dados.'
      },
      {
        question: 'Como saber se minha avaliação foi enviada?',
        answer: 'Você receberá uma confirmação na tela e um e-mail de confirmação será enviado.'
      },
      {
        question: 'Como funciona a avaliação 360°?',
        answer: 'Inclui autoavaliação (sua própria avaliação), avaliação da chefia e feedback da equipe.'
      }
    ]
  },
  {
    category: 'Dados e Privacidade',
    items: [
      {
        question: 'Quem pode ver minhas avaliações?',
        answer: 'Apenas sua chefia direta e a coordenação de RH têm acesso às suas avaliações.'
      },
      {
        question: 'Minha avaliação é anonima?',
        answer: 'Sim, caso você tenha avaliado alguem, seu nome ficara em anonimato, exceto se tenha avaliado a si mesmo'
      },
      {
        question: 'O sistema é seguro?',
        answer: 'Sim, utilizamos criptografia de ponta a ponta, controle de acesso granular e conformidade LGPD.'
      },
    ]
  },
  {
    category: 'Desenvolvimento e KPIs',
    items: [
      {
        question: 'O que é o Plano de Desenvolvimento Individual (PDI)?',
        answer: 'É um plano personalizado de ações para aprimorar competências e atingir objetivos profissionais.'
      },
      {
        question: 'Como acessar o painel de KPIs?',
        answer: 'No menu, clique em "Painel de KPIs" para visualizar métricas e indicadores de desempenho.'
      },
      {
        question: 'Como funciona a pontuação?',
        answer: 'A pontuação é baseada em critérios objetivos e competências definidas pelo SAMU para sua função.'
      }
    ]
  },
  {
    category: 'Geral',
    items: [
      {
        question: 'Como reportar um erro?',
        answer: 'Envie uma descrição detalhada do erro para suporte@sistema.com.br com screenshots se possível.'
      },
      {
        question: 'Como sugerir melhorias?',
        answer: 'Envie sugestões e feedback para suporte@sistema.com.br. Adoramos ouvir ideias dos usuários!'
      },
      {
        question: 'O que fazer em caso de dúvidas?',
        answer: 'Consulte esta página ou entre em contato com nosso suporte por e-mail ou telefone.'
      }
    ]
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#e0e6eb] rounded-lg overflow-hidden transition-all hover:border-[#cd0048]/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-[#f5f8fb] transition-colors text-left"
      >
        <span className="font-medium text-[#1a1a1a]">{question}</span>
        <ChevronDown
          size={20}
          className={`text-[#cd0048] flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 py-4 bg-[#f9fbfd] border-t border-[#e0e6eb]">
          <p className="text-[#555f69] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQCategory({ category, items, searchTerm }) {
  const filteredItems = useMemo(() => {
    return items.filter(
      item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  if (filteredItems.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-[#cd0048] rounded-full" />
        {category}
      </h3>
      <div className="space-y-3 ml-0">
        {filteredItems.map((item, idx) => (
          <FAQItem key={idx} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');

  const hasResults = faqData.some(category =>
    category.items.some(
      item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      <Nav />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="custom-scrollbar p-8 overflow-y-auto text-left">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#cd0048]/10 rounded-lg">
                <HelpCircle size={24} className="text-[#cd0048]" />
              </div>
              <h1 className="text-3xl font-bold text-[#1a1a1a]">Ajuda e Suporte</h1>
            </div>
            <p className="text-[#555f69] ml-11">
              Encontre respostas para dúvidas comuns ou entre em contato conosco
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-gradient-to-br from-[#cd0048]/5 to-[#cd0048]/10 rounded-xl p-6 border border-[#cd0048]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#cd0048]/20 rounded-lg">
                  <Mail size={20} className="text-[#cd0048]" />
                </div>
                <h2 className="font-semibold text-[#1a1a1a]">E-mail</h2>
              </div>
              <a
                href="mailto:suporte@sistema.com.br"
                className="text-[#cd0048] hover:text-[#a50038] transition-colors font-medium"
              >
                suporte@sistema.com.br
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#cd0048]/5 to-[#cd0048]/10 rounded-xl p-6 border border-[#cd0048]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#cd0048]/20 rounded-lg">
                  <Phone size={20} className="text-[#cd0048]" />
                </div>
                <h2 className="font-semibold text-[#1a1a1a]">Telefone</h2>
              </div>
              <a
                href="tel:+5521999999999"
                className="text-[#cd0048] hover:text-[#a50038] transition-colors font-medium"
              >
                (21) 99999-9999
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-10">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
              <input
                type="text"
                placeholder="Pesquise por palavras-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#e0e6eb] rounded-lg focus:outline-none focus:border-[#cd0048] focus:ring-2 focus:ring-[#cd0048]/10 transition-all"
              />
            </div>
          </div>

          {/* FAQ Sections */}
          <div>
            {hasResults ? (
              <>
                {searchTerm && (
                  <p className="text-sm text-[#999] mb-6">
                    {faqData.reduce(
                      (count, cat) =>
                        count +
                        cat.items.filter(
                          item =>
                            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length,
                      0
                    )}{' '}
                    resultado(s) encontrado(s)
                  </p>
                )}
                {faqData.map((category) => (
                  <FAQCategory
                    key={category.category}
                    category={category.category}
                    items={category.items}
                    searchTerm={searchTerm}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 text-[#cd0048]/30">
                  <Search size={48} className="mx-auto mb-2" />
                </div>
                <p className="text-[#555f69] font-medium">Nenhum resultado encontrado</p>
                <p className="text-[#999] text-sm mt-1">
                  Tente uma busca diferente ou entre em contato com o suporte
                </p>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          {!searchTerm && (
            <div className="mt-12 pt-8 border-t border-[#e0e6eb]">
              <div className="bg-[#f5f8fb] rounded-xl p-6 text-center">
                <p className="text-[#555f69] mb-4">
                  Não encontrou o que procura?
                </p>
                <a
                  href="mailto:suporte@sistema.com.br"
                  className="inline-block px-6 py-3 bg-[#cd0048] text-white rounded-lg font-medium hover:bg-[#a50038] transition-colors"
                >
                  Entrar em Contato com Suporte
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}