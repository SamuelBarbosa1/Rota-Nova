import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Car, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  Navigation, 
  BarChart3, 
  PieChart, 
  Activity, 
  Check, 
  Ban, 
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

export default function Admin() {
  const { currentUser, driversList, approveDriver, toggleDriverStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('visao_geral'); // 'visao_geral' | 'motoristas' | 'faturamento' | 'corridas'
  const [searchDriver, setSearchDriver] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); // 'todos' | 'Aprovado' | 'Pendente' | 'Suspenso'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Calculated metrics from context data
  const totalDrivers = driversList ? driversList.length : 0;
  const approvedDrivers = driversList ? driversList.filter(d => d.status === 'Aprovado').length : 0;
  const pendingDrivers = driversList ? driversList.filter(d => d.status === 'Pendente').length : 0;

  // Filtered drivers list
  const filteredDrivers = (driversList || []).filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
      driver.carModel.toLowerCase().includes(searchDriver.toLowerCase()) ||
      driver.carPlate.toLowerCase().includes(searchDriver.toLowerCase()) ||
      driver.region.toLowerCase().includes(searchDriver.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Mock platform financial totals
  const totalGrossVolume = 14850.00;
  const platformFeePercentage = 0.10; // 10% transparent fee
  const platformEarnings = totalGrossVolume * platformFeePercentage;
  const driverPayouts = totalGrossVolume * 0.90;

  // Mock recent trips stream
  const mockTrips = [
    {
      id: 'ROT-9102',
      date: 'Hoje, 12:10',
      client: 'Juliana Mendes',
      driver: 'Carlos Eduardo Silva',
      vehicle: 'Toyota Corolla (JKL-9812)',
      origin: 'Eixo Monumental, Bloco A (Brasília)',
      destination: 'Sol Nascente, Trecho 3 (Estrada de Terra)',
      category: 'Rota Nova Comfort',
      price: 34.50,
      fee: 3.45,
      isUnpaved: true,
      status: 'Em Andamento'
    },
    {
      id: 'ROT-9101',
      date: 'Hoje, 11:45',
      client: 'Marcos Paulo',
      driver: 'Roberto Barbosa',
      vehicle: 'Toyota Etios (ABC-5E67)',
      origin: 'Ceilândia Centro (Estação Metrô)',
      destination: 'Colônia Agrícola Samambaia, Chácara 102',
      category: 'Rota Nova Pop',
      price: 26.00,
      fee: 2.60,
      isUnpaved: true,
      status: 'Concluída'
    },
    {
      id: 'ROT-9099',
      date: 'Hoje, 10:30',
      client: 'Fernanda Lima',
      driver: 'Patricia Albuquerque',
      vehicle: 'Honda City (STU-1122)',
      origin: 'Taguatinga Shopping',
      destination: 'Sol Nascente, Trecho 1 (Quadra 5)',
      category: 'Rota Nova Pop',
      price: 22.80,
      fee: 2.28,
      isUnpaved: false,
      status: 'Concluída'
    },
    {
      id: 'ROT-9095',
      date: 'Hoje, 09:15',
      client: 'Gabriel Souza',
      driver: 'Marcos Vinicius Santos',
      vehicle: 'Nissan Versa (MNO-3321)',
      origin: 'Feira Central de Ceilândia',
      destination: 'Sol Nascente, Trecho 2, Chácara 44',
      category: 'Rota Nova Pop',
      price: 29.90,
      fee: 2.99,
      isUnpaved: true,
      status: 'Concluída'
    }
  ];

  const handleApprove = (driverId, driverName) => {
    approveDriver(driverId);
    showToast(`Motorista ${driverName} foi APROVADO com sucesso!`);
  };

  const handleToggleStatus = (driverId, driverName, currentStatus) => {
    toggleDriverStatus(driverId);
    const newStatus = currentStatus === 'Aprovado' ? 'Suspenso' : 'Aprovado';
    showToast(`Status de ${driverName} alterado para: ${newStatus.toUpperCase()}`);
  };

  const handleExportCSV = () => {
    showToast("Relatório financeiro e de motoristas exportado com sucesso (formato CSV/Excel).");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 bg-emerald-500 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-400 border border-purple-500/40 uppercase tracking-widest flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Área Restrita do Administrativo</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Plataforma Online</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Painel Geral de Gestão & Faturamento
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Acompanhamento em tempo real de motoristas cadastrados, validação de entrevistas, fluxo de faturamento da taxa fixa de 10% e operações no Sol Nascente e Distrito Federal.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-amber-950/40"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Drivers */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Motoristas Cadastrados</span>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Car className="w-6 h-6" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{totalDrivers}</span>
            <div className="flex items-center justify-between text-xs mt-2 text-slate-400">
              <span className="text-emerald-400 font-bold">{approvedDrivers} Aprovados</span>
              <span className="text-amber-400 font-bold">{pendingDrivers} Pendentes</span>
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passageiros Ativos</span>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">1.480</span>
            <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">+14% este mês</span>
            </p>
          </div>
        </div>

        {/* Platform Revenue (10% Fee) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receita RotaNova (10%)</span>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-400">
              R$ {platformEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-slate-400 mt-2">
              Sobre volume bruto de R$ {totalGrossVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Total Trips */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corridas Realizadas</span>
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
              <Navigation className="w-6 h-6" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">648</span>
            <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">98.4% concluídas com sucesso</span>
            </p>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('visao_geral')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'visao_geral'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Visão Geral & Desempenho</span>
        </button>

        <button
          onClick={() => setActiveTab('motoristas')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 whitespace-nowrap relative ${
            activeTab === 'motoristas'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Motoristas Cadastrados</span>
          {pendingDrivers > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black animate-pulse">
              {pendingDrivers}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('faturamento')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'faturamento'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Faturamento & Repasses</span>
        </button>

        <button
          onClick={() => setActiveTab('corridas')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'corridas'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Monitoramento de Corridas</span>
        </button>
      </div>

      {/* Tab 1: Visão Geral */}
      {activeTab === 'visao_geral' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Revenue & Rides Overview Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Desempenho Semanal de Corridas & Faturamento</h2>
                  <p className="text-xs text-slate-400">Volume diário de faturamento bruto e comissão retida (10%).</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  Agosto 2026
                </span>
              </div>

              {/* Bar Chart Visual */}
              <div className="space-y-4 pt-4">
                {[
                  { day: 'Segunda', gross: 1850, fee: 185, rides: 78 },
                  { day: 'Terça', gross: 2100, fee: 210, rides: 89 },
                  { day: 'Quarta', gross: 1940, fee: 194, rides: 82 },
                  { day: 'Quinta', gross: 2400, fee: 240, rides: 104 },
                  { day: 'Sexta', gross: 3100, fee: 310, rides: 135 },
                  { day: 'Sábado', gross: 3460, fee: 346, rides: 160 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300 w-20">{item.day}</span>
                      <span className="text-slate-400">{item.rides} corridas</span>
                      <span className="text-amber-400 font-bold">Bruto: R$ {item.gross}</span>
                      <span className="text-emerald-400 font-bold">Taxa (10%): R$ {item.fee}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${(item.gross / 3500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Distribution */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <PieChart className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-black text-white">Atendimento por Região</h3>
                </div>
                <p className="text-xs text-slate-400 mb-6">Concentração das solicitações de motoristas e passageiros.</p>

                <div className="space-y-4">
                  {[
                    { region: 'Sol Nascente (Trecho 1, 2 e 3)', percent: 52, color: 'bg-amber-500' },
                    { region: 'Colônia Agrícola Samambaia', percent: 24, color: 'bg-blue-500' },
                    { region: 'Ceilândia Norte & Sul', percent: 14, color: 'bg-purple-500' },
                    { region: 'Taguatinga / Recanto das Emas', percent: 10, color: 'bg-emerald-500' }
                  ].map((r, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-300">{r.region}</span>
                        <span className="text-white font-bold">{r.percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mt-6">
                <strong>Destaque RotaNova:</strong> 76% das viagens atendem trechos sem asfaltamento ou vias de difíceis acessos não integradas por apps tradicionais.
              </div>
            </div>

          </div>

          {/* Quick Pending Approvals Alert Card */}
          {pendingDrivers > 0 && (
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-black">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">Existem {pendingDrivers} cadastros de motoristas aguardando aprovação</h4>
                  <p className="text-xs text-slate-400">Valide os documentos e notas de entrevista para liberar a conta.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('motoristas');
                  setStatusFilter('Pendente');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs whitespace-nowrap shadow-lg shadow-amber-500/20"
              >
                Revisar Pendentes
              </button>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Motoristas Cadastrados */}
      {activeTab === 'motoristas' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Filters & Search Header */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchDriver}
                onChange={(e) => setSearchDriver(e.target.value)}
                placeholder="Buscar por nome, placa, modelo ou região..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 mr-2 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrar:</span>
              </span>
              {[
                { label: 'Todos', value: 'todos' },
                { label: 'Aprovados', value: 'Aprovado' },
                { label: 'Pendentes', value: 'Pendente' },
                { label: 'Suspensos', value: 'Suspenso' }
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setStatusFilter(btn.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                    statusFilter === btn.value
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

          </div>

          {/* Drivers List Table */}
          <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 uppercase font-extrabold text-[11px] text-slate-400 border-b border-slate-800 tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Motorista</th>
                    <th className="py-4 px-6">Veículo & Placa</th>
                    <th className="py-4 px-6">Região de Atuação</th>
                    <th className="py-4 px-6 text-center">Entrevista Presencial</th>
                    <th className="py-4 px-6 text-center">Corridas</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Ações de Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDrivers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500 font-medium">
                        Nenhum motorista encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* Driver Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 text-sm">
                              {driver.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{driver.name}</p>
                              <p className="text-[11px] text-slate-400">{driver.phone} • {driver.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Vehicle & Plate */}
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-200">{driver.carModel}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono font-bold text-amber-400 border border-slate-800">
                            {driver.carPlate}
                          </span>
                        </td>

                        {/* Region */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>{driver.region}</span>
                          </div>
                        </td>

                        {/* Interview Score */}
                        <td className="py-4 px-6 text-center">
                          {driver.interviewPassed ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Aprovado ({driver.interviewScore}/100)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pendente de Validação</span>
                            </span>
                          )}
                        </td>

                        {/* Total Rides */}
                        <td className="py-4 px-6 text-center font-bold text-white">
                          {driver.ridesCompleted}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                            driver.status === 'Aprovado'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : driver.status === 'Pendente'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}>
                            {driver.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right space-x-2">
                          {driver.status === 'Pendente' ? (
                            <button
                              onClick={() => handleApprove(driver.id, driver.name)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 inline-flex items-center space-x-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aprovar Cadastro</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(driver.id, driver.name, driver.status)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1 ${
                                driver.status === 'Aprovado'
                                  ? 'bg-slate-800 hover:bg-rose-950/80 text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40'
                              }`}
                            >
                              {driver.status === 'Aprovado' ? (
                                <>
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Suspender</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span>Reativar</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Faturamento & Repasses */}
      {activeTab === 'faturamento' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Revenue Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Volume Bruto Transacionado</span>
              <p className="text-3xl font-black text-white">
                R$ {totalGrossVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400">Total movimentado em corridas no aplicativo.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">Comissão RotaNova (10%)</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">Taxa Fixa</span>
              </div>
              <p className="text-3xl font-black text-amber-400">
                R$ {platformEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400">Receita retida pela plataforma para operação e tecnologia.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">Repasse aos Motoristas (90%)</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Sem pegadinhas</span>
              </div>
              <p className="text-3xl font-black text-emerald-400">
                R$ {driverPayouts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400">Valor total líquido destinado aos motoristas parceiros.</p>
            </div>

          </div>

          {/* Billing & Payout Ledger Table */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Extrato de Faturamento Diário</h3>
                <p className="text-xs text-slate-400">Detalhamento dos valores recebidos e repasses agendados via PIX.</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl border border-slate-800 text-xs flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Baixar Extrato Completo</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 uppercase font-extrabold text-[11px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Qtd. Corridas</th>
                    <th className="py-3 px-4">Faturamento Bruto</th>
                    <th className="py-3 px-4 text-amber-400">Comissão RotaNova (10%)</th>
                    <th className="py-3 px-4 text-emerald-400">Repasse Motoristas (90%)</th>
                    <th className="py-3 px-4 text-center">Status do Repasse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { date: '28/08/2026 (Hoje)', rides: 42, gross: 1485.00, fee: 148.50, payout: 1336.50, status: 'Processando (PIX Noturno)' },
                    { date: '27/08/2026', rides: 88, gross: 3120.00, fee: 312.00, payout: 2808.00, status: 'Concluído (PIX Efetuado)' },
                    { date: '26/08/2026', rides: 94, gross: 3410.00, fee: 341.00, payout: 3069.00, status: 'Concluído (PIX Efetuado)' },
                    { date: '25/08/2026', rides: 76, gross: 2680.00, fee: 268.00, payout: 2412.00, status: 'Concluído (PIX Efetuado)' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-white">{row.date}</td>
                      <td className="py-3.5 px-4">{row.rides} corridas</td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">R$ {row.gross.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">R$ {row.fee.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">R$ {row.payout.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          row.status.includes('Concluído')
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Monitoramento de Corridas */}
      {activeTab === 'corridas' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white">Monitoramento de Corridas em Tempo Real</h3>
              <p className="text-xs text-slate-400">Acompanhamento das corridas aceitas no Distrito Federal e regiões desatendidas.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Servidor de Rotas Ativo</span>
            </span>
          </div>

          {/* Trips Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockTrips.map((trip) => (
              <div key={trip.id} className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4 hover:border-amber-500/40 transition-all">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black text-amber-400">{trip.id}</span>
                    <span className="text-xs text-slate-400">• {trip.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    trip.status === 'Em Andamento'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {trip.status}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Origem:</span>
                      <span className="font-semibold text-slate-200">{trip.origin}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Navigation className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Destino:</span>
                      <span className="font-semibold text-slate-200">{trip.destination}</span>
                      {trip.isUnpaved && (
                        <span className="ml-2 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/20">
                          Estrada de Terra / Sem Asfalto
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Motorista Atribuído:</span>
                    <span className="font-bold text-white">{trip.driver}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Valor (Taxa 10%: R$ {trip.fee.toFixed(2)})</span>
                    <span className="font-black text-amber-400 text-sm">R$ {trip.price.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
