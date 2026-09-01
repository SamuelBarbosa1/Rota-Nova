import React, { useState } from 'react';
import { 
  QrCode, Copy, Check, ExternalLink, HeartHandshake, ShieldCheck, 
  X, Sparkles, DollarSign, Wallet, ArrowRight 
} from 'lucide-react';

export default function PixApoioModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  if (!isOpen) return null;

  const pixUrl = "https://cobranca.c6pix.com.br/01KXDM3SKSR75RMGNR6A9APKCX";
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixUrl)}&color=020617&bgcolor=ffffff`;

  const beneficiaryInfo = {
    nome: "MAX LENNER DIOGO DE MORAIS",
    documento: "053.391.481-73",
    instituicao: "Banco C6 S.A. (C6 Bank)",
    tipo: "Cobrança Pix / Valor Livre",
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pixUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const presets = [
    { label: 'R$ 10', desc: 'Incentivo ao Projeto', value: 10 },
    { label: 'R$ 25', desc: 'Apoio Infraestrutura', value: 25 },
    { label: 'R$ 50', desc: 'Acelerador Regional', value: 50 },
    { label: 'R$ 100+', desc: 'Cota Apoiador Master', value: 100 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Apoio Comunitário & Investimento Simbólico</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Apoie o Projeto <span className="text-amber-400">Rota Nova</span>
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Ajude a acelerar a expansão da mobilidade sem cancelamentos e apoie a evolução contínua da nossa tecnologia.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="relative p-3 bg-white rounded-2xl shadow-xl shadow-amber-500/10 border-2 border-amber-500/30 group">
            <img
              src={qrCodeImgUrl}
              alt="QR Code Pix C6 Bank"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
            />
            <div className="absolute inset-0 rounded-2xl bg-amber-500/10 pointer-events-none border border-amber-400/20" />
          </div>

          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
              <QrCode className="w-4 h-4" />
              Abra seu aplicativo de banco e aponte a câmera
            </span>
            <p className="text-[11px] text-slate-400">
              Valor livre: Você escolhe a quantia que desejar transferir
            </p>
          </div>
        </div>

        {/* Dados do Beneficiário */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-slate-400">Beneficiário:</span>
            <strong className="text-white font-bold">{beneficiaryInfo.nome}</strong>
          </div>
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-slate-400">CPF / Chave:</span>
            <span className="text-slate-300 font-mono">{beneficiaryInfo.documento}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Instituição:</span>
            <span className="text-amber-400 font-semibold">{beneficiaryInfo.instituicao}</span>
          </div>
        </div>

        {/* Sugestões de Apoio */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Sugestões de contribuição simbólica:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedPreset(preset.value)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedPreset === preset.value
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-sm">{preset.label}</div>
                <div className="text-[9px] opacity-80 leading-tight mt-0.5">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Link Copiado com Sucesso!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copiar Link do Pix</span>
              </>
            )}
          </button>

          <a
            href={pixUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all text-xs"
          >
            <span>Pagar / Abrir no C6 Bank</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Pagamento instantâneo e 100% seguro via Banco Central</span>
        </div>

      </div>
    </div>
  );
}
