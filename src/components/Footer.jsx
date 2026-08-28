import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, FileText, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
                <Car className="w-5 h-5 font-bold" />
              </div>
              <span className="text-xl font-black text-white">Rota<span className="text-amber-400">Nova!</span></span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              A plataforma de mobilidade que garante transparência. Entrevista prévia para motoristas, sem discriminação de destino e com compromisso total de entrega.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/40 p-2.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Regra de Ouro: Aceitou a corrida, leva até o final.</span>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Acesso Rápido</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">Página Inicial</Link>
              </li>
              <li>
                <Link to="/cliente" className="hover:text-amber-400 transition-colors">Solicitar Corrida (Passageiro)</Link>
              </li>
              <li>
                <Link to="/motorista" className="hover:text-amber-400 transition-colors">Quero Dirigir (Entrevista & Cadastro)</Link>
              </li>
              <li>
                <Link to="/regras" className="hover:text-amber-400 transition-colors">Regras Antibloqueio e Exceções</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Regras e Compromisso */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Compromisso social</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Zero recusa por bairro ou ladeira</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Atendimento em estradas de terra</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Entrevista presencial/virtual prévia</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Penalidade progressiva para cancelamentos</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Suporte e Contato */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Atendimento & Ouvidoria</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>0800 700 ROTA (7682)</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>projeto.nova1@gmail.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Brasília, DF — Atendimento Brasil</span>
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Rota Nova Tecnologias de Mobilidade S.A. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/regras" className="hover:text-slate-400">Termos de Uso</Link>
            <Link to="/regras" className="hover:text-slate-400">Privacidade</Link>
            <Link to="/regras" className="hover:text-slate-400">Diretrizes do Motorista</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
