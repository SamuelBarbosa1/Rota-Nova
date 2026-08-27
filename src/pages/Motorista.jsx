import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  Car, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, 
  ArrowRight, Award, DollarSign, Activity, FileCheck, Phone, Mail, 
  User, ShieldAlert, TrendingUp, Percent, Clock, AlertCircle, Wrench, Send, Lock 
} from 'lucide-react';

export default function Motorista() {
  const { currentUser, completeInterview } = useAuth();
  const [activeTab, setActiveTab] = useState('cockpit'); // 'cockpit' | 'financeiro' | 'entrevista'
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Online / Radar state
  const [isOnline, setIsOnline] = useState(true);
  const [activeCall, setActiveCall] = useState(null);
  const [acceptedRide, setAcceptedRide] = useState(null);

  // Exception form state
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionData, setExceptionData] = useState({
    type: 'pane_mecanica',
    description: '',
    photoUploaded: true
  });
  const [exceptionSubmitted, setExceptionSubmitted] = useState(false);

  // Interview Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizError, setQuizError] = useState('');
  const [quizFailed, setQuizFailed] = useState(null); // null | { score, correctCount, totalCount }

  const handleQuizSubmit = () => {
    const answeredKeys = Object.keys(quizAnswers);
    if (answeredKeys.length < questions.length) {
      setQuizError(`Atenção: Por favor, selecione uma resposta para todas as ${questions.length} perguntas antes de enviar. (${answeredKeys.length}/${questions.length} respondidas)`);
      return;
    }
    setQuizError('');

    let correctCount = 0;
    questions.forEach(q => {
      const selected = quizAnswers[q.id];
      const correctOpt = q.options.find(o => o.correct);
      if (selected === correctOpt?.key) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);

    if (calculatedScore >= 75) {
      setQuizFailed(null);
      completeInterview(calculatedScore);
    } else {
      setQuizFailed({
        score: calculatedScore,
        correctCount,
        totalCount: questions.length
      });
    }
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizFailed(null);
    setQuizError('');
  };

  const questions = [
    {
      id: 1,
      question: "O cliente solicita uma corrida e o destino final é uma estrada de chão / rua de terra. Qual é a conduta exigida pela Rota Nova!?",
      options: [
        { key: 'A', text: "Levar o passageiro até a porta do destino com respeito e cordialidade.", correct: true },
        { key: 'B', text: "Pedir para o passageiro cancelar alegando que terra estraga a suspensão.", correct: false },
        { key: 'C', text: "Cobrar taxa extra por fora para rodar em estrada de chão.", correct: false }
      ],
      explanation: "No Rota Nova!, o acesso a estradas de chão ou vias não asfaltadas faz parte da mobilidade democrática e NUNCA é motivo de cancelamento."
    },
    {
      id: 2,
      question: "Após aceitar a corrida no aplicativo, o que é estritamente proibido ao motorista parceiro?",
      options: [
        { key: 'A', text: "Cancelar a corrida por causa da região, bairro ou comunidade de destino.", correct: true },
        { key: 'B', text: "Ligar para confirmar se o passageiro já está no local de embarque.", correct: false },
        { key: 'C', text: "Ligar o ar-condicionado durante a viagem.", correct: false }
      ],
      explanation: "Cancelar por causa do bairro de destino é considerado discriminação geográfica e infração gravíssima."
    },
    {
      id: 3,
      question: "Qual das situações abaixo representa uma exceção VÁLIDA para cancelamento emergencial sem penalidade?",
      options: [
        { key: 'A', text: "Pane mecânica comprovada do veículo (com foto no app) ou risco iminente de segurança no local.", correct: true },
        { key: 'B', text: "Achou o valor da corrida abaixo do esperado depois que aceitou.", correct: false },
        { key: 'C', text: "O passageiro vai desembarcar em uma casa de fundos.", correct: false }
      ],
      explanation: "Apenas riscos reais comprovados ou quebras mecânicas registradas são aceitos como exceção legal."
    },
    {
      id: 4,
      question: "Qual é a penalidade máxima aplicada ao motorista que acumula 4 cancelamentos indevidos por causa de destino?",
      options: [
        { key: 'A', text: "Descredenciamento e banimento definitivo da conta Rota Nova!.", correct: true },
        { key: 'B', text: "Apenas um aviso verbal por e-mail.", correct: false },
        { key: 'C', text: "Perda de 5 pontos na carteira de motorista.", correct: false }
      ],
      explanation: "A tolerância para recusas recorrentes por local é zero. No 4º cancelamento indevido, a conta é encerrada definitivamente."
    }
  ];

  // GATEKEEPER LOCK SCREEN IF UNAUTHENTICATED OR NOT A DRIVER
  if (!currentUser || currentUser.role !== 'motorista') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Portal Restrito do Condutor</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Cadastre-se como Motorista para acessar o Painel
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Para prestar serviços, realizar sua Entrevista Obrigatória de Segurança e acessar o Cockpit de corridas ao vivo com relatório de ganhos líquidos, crie sua conta de motorista parceiro.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-xl shadow-amber-500/20 text-sm transition-all flex items-center justify-center space-x-2"
              >
                <Car className="w-4 h-4" />
                <span>Quero me Cadastrar como Motorista</span>
              </button>

              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold py-4 rounded-xl text-sm transition-colors"
              >
                Já sou Motorista (Entrar)
              </button>
            </div>

          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialRole="motorista"
        />
      </div>
    );
  }

  const driverName = currentUser?.name || 'Motorista';
  const carModel = currentUser?.driverData?.carModel || 'Veículo Registrado';
  const carPlate = currentUser?.driverData?.carPlate || 'JKL-0000';

  const simulateIncomingCall = () => {
    setActiveCall({
      id: 'CALL-902',
      pickup: 'Setor de Indústrias Gráficas (SIG), Quadra 1 — Brasília, DF',
      dropoff: 'Colônia Agrícola 26 de Julho, Chácara 80 (Estrada de Terra) — DF',
      price: 'R$ 38,40',
      distance: '8.2 km',
      passenger: 'Carlos M.'
    });
  };

  const handleAcceptRideCall = () => {
    setAcceptedRide(activeCall);
    setActiveCall(null);
  };

  const handleExceptionSubmit = (e) => {
    e.preventDefault();
    setExceptionSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER DO DASHBOARD DO MOTORISTA (AUTENTICADO) */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-2xl shadow-lg">
              {driverName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  currentUser.driverData?.interviewPassed 
                    ? 'text-amber-400 bg-amber-950 border-amber-800' 
                    : 'text-rose-400 bg-rose-950 border-rose-800 animate-pulse'
                }`}>
                  {currentUser.driverData?.interviewPassed ? '✓ MOTORISTA CREDENCIADO & ENTREVISTADO' : '⚠️ PENDENTE: ENTREVISTA OBRIGATÓRIA'}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white mt-1">
                Dashboard do Motorista — {driverName}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {carModel} • Placa <strong className="text-slate-200">{carPlate}</strong> • Avaliação: <strong className="text-amber-400">{currentUser.stats?.rating || 5.0} ★</strong>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('cockpit')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'cockpit'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Cockpit ao Vivo</span>
            </button>

            <button
              onClick={() => setActiveTab('financeiro')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'financeiro'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Relatório Financeiro</span>
            </button>

            <button
              onClick={() => setActiveTab('entrevista')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'entrevista'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Entrevista & Regras</span>
            </button>
          </div>

        </div>

        {/* TAB 1: COCKPIT AO VIVO */}
        {activeTab === 'cockpit' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center space-x-3">
                <div className={`w-3.5 h-3.5 rounded-full ${isOnline ? 'bg-amber-400 animate-ping' : 'bg-slate-500'}`}></div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isOnline ? 'Modo Online — Prontidão Rota Nova!' : 'Modo Offline (Pausa)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isOnline ? 'Pronto para receber chamadas de passageiros na sua região' : 'Ative para começar a rodar e faturar'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-6 py-3 rounded-xl font-black text-xs transition-all shadow-lg flex items-center space-x-2 ${
                  isOnline
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{isOnline ? 'DESATIVAR RADAR (IR OFFLINE)' : 'FICAR ONLINE AGORA'}</span>
              </button>

            </div>

            {/* RADAR */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    Radar de Corridas Rota Nova! em Tempo Real
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Alertas de chamadas validadas sem filtro de bairro.</p>
                </div>

                {isOnline && !activeCall && !acceptedRide && (
                  <button
                    onClick={simulateIncomingCall}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Simular Nova Chamada Chegando
                  </button>
                )}
              </div>

              {activeCall && (
                <div className="bg-slate-900 border-2 border-amber-500 p-6 rounded-2xl space-y-4 animate-bounce-subtle">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                      NOVA CORRIDA DISPONÍVEL
                    </span>
                    <span className="text-xl font-black text-white">{activeCall.price}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300"><strong>Embarque:</strong> {activeCall.pickup}</p>
                    <p className="text-slate-300"><strong>Desembarque:</strong> <span className="text-amber-400 font-semibold">{activeCall.dropoff}</span></p>
                    <p className="text-xs text-slate-400">Passageiro: {activeCall.passenger} • Distância: {activeCall.distance}</p>
                  </div>

                  <div className="bg-amber-950/80 border border-amber-800 p-3 rounded-xl text-xs text-amber-300 font-medium">
                    ⚠️ Compromisso da Regra de Ouro: Ao aceitar esta viagem, você se compromete a concluí-la sem cancelamento.
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAcceptRideCall}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition-colors text-sm"
                    >
                      Aceitar Corrida (Compromisso Assumido)
                    </button>
                    <button
                      onClick={() => setActiveCall(null)}
                      className="px-6 bg-slate-800 text-slate-400 font-bold rounded-xl text-xs hover:text-white"
                    >
                      Recusar Antes de Aceitar
                    </button>
                  </div>

                </div>
              )}

              {acceptedRide && (
                <div className="bg-amber-950/60 border border-amber-500/60 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      Corrida em Andamento (Regra Aceitou, Levou Ativa)
                    </h4>
                    <span className="text-sm font-black text-amber-400">{acceptedRide.price}</span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p>Origem: {acceptedRide.pickup}</p>
                    <p>Destino: <strong className="text-amber-400">{acceptedRide.dropoff}</strong></p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setAcceptedRide(null)}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-colors"
                    >
                      Finalizar Viagem e Receber R$ 38,40 na Carteira
                    </button>
                    <button
                      onClick={() => setShowExceptionModal(true)}
                      className="px-4 bg-rose-950/60 border border-rose-500/40 text-rose-400 font-bold rounded-xl text-xs hover:bg-rose-900/60"
                    >
                      Reportar Emergência/Pane Mecânica
                    </button>
                  </div>
                </div>
              )}

              {!activeCall && !acceptedRide && (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Car className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="text-sm font-medium">Aguardando chamadas de passageiros na sua área...</p>
                  <p className="text-xs">O radar Rota Nova! prioriza motoristas credenciados com nota alta.</p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: RELATÓRIO FINANCEIRO */}
        {activeTab === 'financeiro' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Ganhos Brutos (Semana)</p>
                <p className="text-3xl font-black text-amber-400 mt-2">R$ {(currentUser.stats?.grossEarnings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[11px] text-slate-400 mt-1">Acumulado de {currentUser.stats?.ridesCompleted || 0} corridas</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Taxa Rota Nova! (10%)</p>
                <p className="text-3xl font-black text-rose-400 mt-2">-R$ {(currentUser.stats?.platformFee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[11px] text-slate-400 mt-1">Taxa justa de intermediação</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Gastos Est. Combustível</p>
                <p className="text-3xl font-black text-amber-400 mt-2">-R$ {(currentUser.stats?.fuelEstimate || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[11px] text-slate-400 mt-1">Calculado sobre a quilometragem</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-amber-950/60 to-slate-900">
                <p className="text-xs text-amber-300 font-bold uppercase">LUCRO LÍQUIDO NO BOLSO</p>
                <p className="text-3xl font-black text-amber-400 mt-2">R$ {(currentUser.stats?.netProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[11px] text-amber-300 mt-1">~ R$ {currentUser.stats?.hoursOnline > 0 ? (currentUser.stats.netProfit / currentUser.stats.hoursOnline).toFixed(2) : '0.00'} / hora rodada</p>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  Demonstrativo Detalhado do Motorista
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-300">Faturamento Bruto Total</span>
                    <span className="font-black text-amber-400">R$ {(currentUser.stats?.grossEarnings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-300">Desconto Taxa de Serviço Rota Nova! (10%)</span>
                    <span className="font-black text-rose-400">- R$ {(currentUser.stats?.platformFee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-300">Est. Combustível (Gasolina/Etanol/GNV)</span>
                    <span className="font-black text-amber-400">- R$ {(currentUser.stats?.fuelEstimate || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-amber-950 border border-amber-500 rounded-xl font-bold text-sm">
                    <span className="text-white">Resultado Líquido Final</span>
                    <span className="text-amber-400 font-black">R$ {(currentUser.stats?.netProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  Indicadores de Reputação
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span>Taxa de Aceitação</span>
                    <span className="font-extrabold text-amber-400">{currentUser.stats?.acceptanceRate || 100}%</span>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span>Cancelamentos por Bairro</span>
                    <span className="font-extrabold text-amber-400">0 (Nenhum)</span>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span>Avaliação Média</span>
                    <span className="font-extrabold text-amber-400">{currentUser.stats?.rating || 5.0} ★</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: ENTREVISTA & REGRAS */}
        {activeTab === 'entrevista' && (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                Histórico de Entrevista & Regulamento
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser.driverData?.interviewPassed 
                  ? 'Sua avaliação de conduta foi concluída e aprovada.' 
                  : 'Responda o questionário obrigatório abaixo para liberar seu credenciamento e começar a aceitar corridas.'}
              </p>
            </div>

            {currentUser.driverData?.interviewPassed ? (
              <div className="bg-amber-950/60 border border-amber-500/40 p-6 rounded-2xl space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-amber-400" />
                  <div>
                    <h4 className="text-lg font-black text-white">Certificado de Aprovação de Conduta Rota Nova!</h4>
                    <p className="text-xs text-slate-300">Nota Obtida: {currentUser.driverData?.interviewScore || 100}/100 • Validade: Ativa (Condutor Credenciado)</p>
                  </div>
                </div>
              </div>
            ) : quizFailed ? (
              <div className="bg-rose-950/80 border border-rose-500/60 p-6 rounded-2xl space-y-4 text-center">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
                <h4 className="text-xl font-black text-white">REPROVADO NA ENTREVISTA DE CONDUTA</h4>
                <p className="text-3xl font-black text-rose-400">Nota: {quizFailed.score}/100</p>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Você acertou <strong>{quizFailed.correctCount} de {quizFailed.totalCount}</strong> perguntas. O Rota Nova! exige pontuação mínima de <strong>75/100</strong> para credenciar o motorista parceiro e liberar a aceitação de corridas.
                </p>
                <button
                  onClick={handleRetryQuiz}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-colors"
                >
                  Refazer Questionário de Conduta
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl text-xs text-amber-300 font-medium">
                  ⚠️ <strong>Atenção novo condutor:</strong> Para poder aceitar chamadas de passageiros no Rota Nova!, você precisa responder corretamente às perguntas abaixo. Nota mínima para aprovação: 75/100.
                </div>

                {quizError && (
                  <div className="bg-rose-950/80 border border-rose-500 text-rose-300 p-4 rounded-xl text-xs font-bold animate-bounce-subtle">
                    {quizError}
                  </div>
                )}

                <div className="space-y-6">
                  {questions.map((q) => (
                    <div key={q.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <p className="text-sm font-bold text-white">{q.id}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt) => (
                          <label key={opt.key} className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors text-xs ${
                            quizAnswers[q.id] === opt.key ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}>
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value={opt.key}
                              checked={quizAnswers[q.id] === opt.key}
                              onChange={() => {
                                setQuizAnswers({...quizAnswers, [q.id]: opt.key});
                                setQuizError('');
                              }}
                              className="accent-amber-500"
                            />
                            <span><strong>({opt.key})</strong> {opt.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleQuizSubmit}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Enviar Respostas e Avaliar Credenciamento</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {showExceptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-rose-500/40 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-rose-400" />
              Registro Emergencial de Exceção
            </h3>
            {!exceptionSubmitted ? (
              <form onSubmit={handleExceptionSubmit} className="space-y-3">
                <select
                  value={exceptionData.type}
                  onChange={(e) => setExceptionData({...exceptionData, type: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                >
                  <option value="pane_mecanica">Pane Mecânica do Veículo</option>
                  <option value="risco_seguranca">Risco Real Comprovado no Local</option>
                </select>
                <textarea
                  value={exceptionData.description}
                  onChange={(e) => setExceptionData({...exceptionData, description: e.target.value})}
                  placeholder="Descreva a ocorrência..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl text-xs"
                >
                  Enviar Registro Legal
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm font-bold text-amber-400">✓ Ocorrência enviada para auditoria Rota Nova! sem penalidade.</p>
                <button
                  onClick={() => {
                    setAcceptedRide(null);
                    setShowExceptionModal(false);
                    setExceptionSubmitted(false);
                  }}
                  className="bg-amber-500 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs"
                >
                  Ok, Voltar ao Cockpit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
