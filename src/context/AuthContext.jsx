import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Limpeza de resquícios de dados mock antigos
  const cleanLegacyMockStorage = () => {
    const legacyKeys = [
      'rotanova_drivers_list',
      'rotanova_users_registry',
      'rotanova_cliente_user',
      'rotanova_motorista_user',
      'rotanova_admin_user',
      'rotanova_investidor_user',
      'rotanova_active_role'
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
  };

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rotanova_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Se for conta demo antiga (ex: juliana@rotanova ou roberto@rotanova), limpar
        if (
          parsed.email === 'juliana@rotanova.com.br' || 
          parsed.email === 'roberto@rotanova.com.br' ||
          parsed.isDemo
        ) {
          cleanLegacyMockStorage();
          localStorage.removeItem('rotanova_auth_user');
          return null;
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved user", e);
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('pedir');
  const [driversList, setDriversList] = useState([]);

  // Sincronizar lista de motoristas reais do Supabase
  const refreshDriversList = async () => {
    const list = await AuthService.getDriversList();
    setDriversList(list);
  };

  useEffect(() => {
    refreshDriversList();
  }, []);

  // Salvar sessão ativa
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rotanova_auth_user', JSON.stringify(currentUser));
      if (currentUser.role === 'cliente') {
        setActiveTab('pedir');
      } else if (currentUser.role === 'motorista') {
        setActiveTab(currentUser.driverData?.interviewPassed ? 'cockpit' : 'entrevista');
      } else if (currentUser.role === 'investidor') {
        setActiveTab('metrics');
      }
    } else {
      localStorage.removeItem('rotanova_auth_user');
    }
  }, [currentUser?.id, currentUser?.role]);

  // LOGIN REAL COM VALIDAÇÃO DE E-MAIL E SENHA NO SUPABASE
  const login = async ({ email, password, role }) => {
    const res = await AuthService.login(email, password, role);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || 'Credenciais inválidas.' };
  };

  // CADASTRO REAL COM CRIAÇÃO DE CONTA NO SUPABASE
  const register = async (userData) => {
    const res = await AuthService.register(userData);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      refreshDriversList();
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || 'Erro ao registrar usuário.' };
  };

  // LOGOUT COMPLETO
  const logout = () => {
    setCurrentUser(null);
    cleanLegacyMockStorage();
    localStorage.removeItem('rotanova_auth_user');
  };

  // Conclusão da entrevista de segurança de motorista
  const completeInterview = async (score) => {
    if (!currentUser || currentUser.role !== 'motorista') return;
    await AuthService.submitDriverInterview(currentUser.id, score);

    const updatedUser = {
      ...currentUser,
      driverData: {
        ...(currentUser.driverData || {}),
        interviewPassed: score >= 75,
        interviewScore: score,
        isOnline: score >= 75
      }
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('rotanova_auth_user', JSON.stringify(updatedUser));
    refreshDriversList();
  };

  // Finalização de corrida por motorista
  const completeDriverTrip = (trip) => {
    if (!currentUser) return;
    const priceVal = typeof trip.price === 'number' 
      ? trip.price 
      : parseFloat(String(trip.price).replace(/[^\d.,]/g, '').replace(',', '.')) || 25.0;

    const currentStats = currentUser.stats || {
      grossEarnings: 0, platformFee: 0, fuelEstimate: 0, netProfit: 0, ridesCompleted: 0
    };

    const fee = priceVal * 0.10;
    const fuel = priceVal * 0.20;
    const net = priceVal - fee;

    const updated = {
      ...currentUser,
      stats: {
        ...currentStats,
        grossEarnings: (currentStats.grossEarnings || 0) + priceVal,
        platformFee: (currentStats.platformFee || 0) + fee,
        fuelEstimate: (currentStats.fuelEstimate || 0) + fuel,
        netProfit: (currentStats.netProfit || 0) + net,
        ridesCompleted: (currentStats.ridesCompleted || 0) + 1
      }
    };
    setCurrentUser(updated);
    localStorage.setItem('rotanova_auth_user', JSON.stringify(updated));
  };

  // Conclusão de corrida por cliente
  const addClientCompletedTrip = (trip) => {
    if (!currentUser) return;
    const priceVal = typeof trip.price === 'number' 
      ? trip.price 
      : parseFloat(String(trip.price).replace(/[^\d.,]/g, '').replace(',', '.')) || 25.0;

    const currentStats = currentUser.stats || { totalSpent: 0, ridesCompleted: 0, tripHistory: [] };
    const updated = {
      ...currentUser,
      stats: {
        ...currentStats,
        totalSpent: (currentStats.totalSpent || 0) + priceVal,
        ridesCompleted: (currentStats.ridesCompleted || 0) + 1,
        tripHistory: [trip, ...(currentStats.tripHistory || [])]
      }
    };
    setCurrentUser(updated);
    localStorage.setItem('rotanova_auth_user', JSON.stringify(updated));
  };

  const switchRole = (newRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    localStorage.setItem('rotanova_auth_user', JSON.stringify(updated));
  };

  // Métodos de compatibilidade (repassam para login/register com verificação)
  const loginAsCliente = (data) => login({ email: data?.email, password: data?.password, role: 'cliente' });
  const loginAsMotorista = (data) => login({ email: data?.email, password: data?.password, role: 'motorista' });
  const loginAsInvestidor = (data) => login({ email: data?.email, password: data?.password, role: 'investidor' });
  const loginAsAdmin = () => {
    const adminUser = {
      id: 'usr_admin',
      name: 'Diretoria Rota Nova',
      email: 'admin@rotanova.app',
      role: 'admin'
    };
    setCurrentUser(adminUser);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      activeTab,
      setActiveTab,
      login,
      register,
      logout,
      completeInterview,
      completeDriverTrip,
      addClientCompletedTrip,
      switchRole,
      driversList,
      refreshDriversList,
      loginAsCliente,
      loginAsMotorista,
      loginAsInvestidor,
      loginAsAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
