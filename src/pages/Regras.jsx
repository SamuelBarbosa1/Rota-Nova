import React, { useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Scale, 
  HelpCircle, ShieldCheck, FileWarning, Send, MessageSquareWarning 
} from 'lucide-react';

export default function Regras() {
  const [activePenaltyStep, setActivePenaltyStep] = useState(1);
  const [denunciaSubmitted, setDenunciaSubmitted] = useState(false);
  const [denunciaData, setDenunciaData] = useState({
    name: '',
    phone: '',
    driverName: '',
    reason: 'recusa_bairro',
    details: ''
  });

  const penalties = [
    {
      step: 1,
      title: "1º Cancelamento Indevido",
      severity: "Advertência Leve",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      description: "Advertência formal por e-mail/notificação e redução automática na pontuação de prioridade no radar de corridas."
    },
    {
      step: 2,
      title: "2º Cancelamento Indevido",
      severity: "Bloqueio Temporário",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      description: "Bloqueio automático de 48 horas sem acesso à plataforma para rodar corridas."
    },
    {
      step: 3,
      title: "3º Cancelamento Indevido",
      severity: "Suspensão & Reentrevista",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      description: "Suspensão de 15 dias corridos e obrigatoriedade de refazer a Entrevista de Segurança & Conduta."
    },
    {
      step: 4,
      title: "4º Cancelamento Indevido",
      severity: "Descredenciamento Definitivo",
      badgeColor: "bg-red-600 text-white border-red-500",
      description: "Banimento e descredenciamento definitivo da conta de motorista parceiro RotaJá. Sem direito a recurso."
    }
  ];

  const handleDenunciaSubmit = (e) => {
    e.preventDefault();
    setDenunciaSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* PAGE HEADER */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center max-w-4xl mx-auto space-y-4">
          
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-4 py-1.5 rounded-full">
            <ShieldAlert className="w-4 h-4" />
            <span>Código Oficial de Conduta & Diretrizes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Regras do aplicativo para motoristas
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Ao aceitar uma corrida na <strong className="text-emerald-400">RotaJá</strong>, o motorista assume o compromisso de levar o passageiro até o destino informado. O local de embarque ou de desembarque <span className="underline decoration-emerald-400">nunca é motivo de cancelamento</span>.
          </p>

        </div>

        {/* 1. REGRA NÚMERO 1 BANNER */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/50 p-8 rounded-3xl space-y-4 shadow-2xl">
          <div className="flex items-center space-x-3 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
            <h2 className="text-2xl font-black text-white">Regra Número 1 — Corrida aceita é corrida realizada</h2>
          </div>
          <p className="text-slate-300 text-base leading-relaxed">
            Depois que o motorista aceita a corrida, ele não pode cancelar por causa do destino do cliente, incluindo <strong className="text-white">entrada de chão, becos, ladeiras, comunidades ou ruas de terra</strong>. Cancelar nessas situações é infração grave e fere os princípios fundamentais da plataforma.
          </p>
        </div>

        {/* 2. PROIBIÇÕES VS EXCEÇÕES (GRID COMPARATIVO) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* O QUE É PROIBIDO */}
          <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">É Estritamente Proibido</h3>
                <p className="text-xs text-rose-400 font-semibold">Infrações sujeitas a penalidades</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span>Cancelar a corrida depois de aceitar por causa do bairro, da comunidade ou da região do destino.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span>Cancelar porque o endereço é entrada de chão, casa de fundos, viela, rua sem asfalto ou de difícil acesso.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span>Pedir para o cliente cancelar a corrida.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span>Negociar valor por fora do aplicativo ou cobrar taxa extra pelo destino.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span>Deixar o passageiro antes do destino final combinado.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span>Recusar o cliente por aparência, raça, religião, deficiência ou animal de assistência.</span>
              </li>
            </ul>
          </div>

          {/* ÚNICAS EXCEÇÕES ACEITAS */}
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Únicas Exceções Aceitas</h3>
                <p className="text-xs text-emerald-400 font-semibold">Situações de emergência real</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>Risco real e comprovado de segurança no momento (bloqueio de via, tiroteio, alagamento).</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>Problema mecânico do veículo, com registro imediato de foto no aplicativo.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>Passageiro em situação de agressão, ameaça ou embriaguez extrema que impeça a viagem com segurança.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>Emergência médica comprovada do motorista.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. SIMULADOR INTERATIVO DE PENALIDADES PROGRESSIVAS */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Sistema de Rigor</span>
            <h3 className="text-3xl font-black text-white">Simulador de Penalidades Progressivas</h3>
            <p className="text-slate-400 text-sm">Clique em cada nível para entender como funciona a escada de sanções da plataforma.</p>
          </div>

          {/* Step buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {penalties.map((pen) => (
              <button
                key={pen.step}
                onClick={() => setActivePenaltyStep(pen.step)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 ${
                  activePenaltyStep === pen.step
                    ? 'bg-slate-800 border-amber-500 shadow-xl scale-105'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70'
                }`}
              >
                <span className="text-xs font-bold text-slate-400">Etapa {pen.step}</span>
                <p className="text-sm font-black text-white leading-tight">{pen.title}</p>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border inline-block w-fit ${pen.badgeColor}`}>
                  {pen.severity}
                </span>
              </button>
            ))}
          </div>

          {/* Active step detailed view */}
          {activePenaltyStep && (
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-3">
                <FileWarning className="w-6 h-6 text-amber-400" />
                <h4 className="text-lg font-black text-white">
                  Detalhes do {penalties.find(p => p.step === activePenaltyStep)?.title}
                </h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {penalties.find(p => p.step === activePenaltyStep)?.description}
              </p>
            </div>
          )}

        </div>

        {/* 4. CANAL DE DENÚNCIA & OUVIDORIA DA COMUNIDADE */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-3xl mx-auto space-y-6">
          
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <MessageSquareWarning className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Canal de Ouvidoria & Denúncia</h3>
              <p className="text-xs text-slate-400">Teve uma viagem recusada indevidamente? Reporte direto para a gerência RotaJá.</p>
            </div>
          </div>

          {!denunciaSubmitted ? (
            <form onSubmit={handleDenunciaSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    value={denunciaData.name}
                    onChange={(e) => setDenunciaData({...denunciaData, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Telefone de Contato</label>
                  <input
                    type="text"
                    value={denunciaData.phone}
                    onChange={(e) => setDenunciaData({...denunciaData, phone: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Motivo do Relato</label>
                <select
                  value={denunciaData.reason}
                  onChange={(e) => setDenunciaData({...denunciaData, reason: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="recusa_bairro">Motorista recusou/cancelou por causa do bairro/destino</option>
                  <option value="recusa_terra">Motorista se recusou a entrar em rua de terra / chão</option>
                  <option value="cobranca_extra">Motorista pediu dinheiro por fora para fazer a corrida</option>
                  <option value="outros">Outra irregularidade grave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Detalhes do Ocorrido</label>
                <textarea
                  value={denunciaData.details}
                  onChange={(e) => setDenunciaData({...denunciaData, details: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  rows={3}
                  placeholder="Informe o nome ou placa do motorista (se houver) e horário aproximado..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg text-sm transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Relato para Auditoria RotaJá</span>
              </button>

            </form>
          ) : (
            <div className="bg-emerald-950/80 border border-emerald-500 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">Denúncia Registrada com Sucesso!</h4>
              <p className="text-xs text-slate-300">
                Sua ocorrência foi encaminhada com prioridade para a nossa junta de auditoria. Caso comprovada a infração, o motorista será notificado e aplicaremos as medidas previstas no contrato.
              </p>
              <button
                onClick={() => setDenunciaSubmitted(false)}
                className="bg-emerald-500 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs"
              >
                Enviar Novo Relato
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
