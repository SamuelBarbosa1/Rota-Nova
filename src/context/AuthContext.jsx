import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rotaja_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.role) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
      localStorage.removeItem('rotaja_user');
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rotaja_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rotaja_user');
    }
  }, [currentUser]);

  const loginAsCliente = (data = {}) => {
    const isDemo = data.isDemo !== undefined ? data.isDemo : false;
    const user = {
      id: `usr_c_${Date.now()}`,
      name: data.name || (isDemo ? 'Juliana Mendes' : 'Cliente Novo'),
      email: data.email || (isDemo ? 'juliana@rotanova.com.br' : 'cliente@rotanova.com.br'),
      phone: data.phone || '(61) 99876-5432',
      role: 'cliente',
      isDemo: isDemo,
      stats: isDemo ? {
        totalSpent: 489.20,
        ridesCompleted: 18,
        ratingGiven: 4.95,
        savedLocations: [
          { id: 1, name: 'Casa', address: 'Sol Nascente, Trecho 3, Chácara 28 (Estrada de Chão) — DF' },
          { id: 2, name: 'Trabalho', address: 'Eixo Monumental, Bloco A — Brasília, DF' }
        ],
        tripHistory: [
          {
            id: 'ROT-9041',
            date: 'Hoje às 18:30',
            origin: 'Eixo Monumental, Bloco A',
            destination: 'Sol Nascente, Trecho 3 (Estrada de Chão)',
            price: 24.50,
            driver: 'Carlos Eduardo (Toyota Corolla)',
            category: 'Rota Nova! Pop',
            status: 'Concluída'
          },
          {
            id: 'ROT-8849',
            date: '26/08/2026 às 19:40',
            origin: 'Rodoviária do Plano Piloto',
            destination: 'Colônia Agrícola Samambaia, Chácara 102 (Rua de Terra)',
            price: 28.90,
            driver: 'Marcos Vinicius (Toyota Etios)',
            category: 'Rota Nova! Comfort',
            status: 'Concluída'
          }
        ]
      } : {
        totalSpent: 0.00,
        ridesCompleted: 0,
        ratingGiven: 5.00,
        savedLocations: [],
        tripHistory: []
      }
    };
    setCurrentUser(user);
    return user;
  };

  const loginAsMotorista = (data = {}) => {
    const isDemo = data.isDemo !== undefined ? data.isDemo : false;
    const user = {
      id: `usr_m_${Date.now()}`,
      name: data.name || (isDemo ? 'Roberto Barbosa' : 'Motorista Parceiro'),
      email: data.email || (isDemo ? 'roberto@rotanova.com.br' : 'motorista@rotanova.com.br'),
      phone: data.phone || '(61) 98765-4321',
      role: 'motorista',
      isDemo: isDemo,
      driverData: {
        carModel: data.carModel || (isDemo ? 'Toyota Etios Sedan 1.5' : 'Veículo Registrado'),
        carPlate: data.carPlate || (isDemo ? 'ABC-5E67' : 'JKL-0000'),
        cnh: data.cnh || '09876543210',
        interviewPassed: isDemo ? true : false,
        interviewScore: isDemo ? 100 : 0
      },
      stats: isDemo ? {
        grossEarnings: 3420.00,
        platformFee: 342.00,
        fuelEstimate: 680.00,
        netProfit: 2398.00,
        ridesCompleted: 58,
        acceptanceRate: 100,
        hoursOnline: 44,
        rating: 4.98
      } : {
        grossEarnings: 0.00,
        platformFee: 0.00,
        fuelEstimate: 0.00,
        netProfit: 0.00,
        ridesCompleted: 0,
        acceptanceRate: 100,
        hoursOnline: 0,
        rating: 5.00
      }
    };
    setCurrentUser(user);
    return user;
  };

  const completeInterview = (score = 100) => {
    if (!currentUser || currentUser.role !== 'motorista') return;
    const updated = {
      ...currentUser,
      driverData: {
        ...currentUser.driverData,
        interviewPassed: true,
        interviewScore: score
      }
    };
    setCurrentUser(updated);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginAsCliente, loginAsMotorista, completeInterview, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
