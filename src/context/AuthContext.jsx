import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const activeRole = localStorage.getItem('rotanova_active_role');
    if (activeRole === 'cliente') {
      const saved = localStorage.getItem('rotanova_cliente_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved client user", e);
        }
      }
    } else if (activeRole === 'motorista') {
      const saved = localStorage.getItem('rotanova_motorista_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved motorista user", e);
        }
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rotanova_active_role', currentUser.role);
      if (currentUser.role === 'cliente') {
        localStorage.setItem('rotanova_cliente_user', JSON.stringify(currentUser));
      } else if (currentUser.role === 'motorista') {
        localStorage.setItem('rotanova_motorista_user', JSON.stringify(currentUser));
      }
    } else {
      localStorage.removeItem('rotanova_active_role');
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
            category: 'Rota Nova Pop',
            status: 'Concluída'
          },
          {
            id: 'ROT-8849',
            date: '26/08/2026 às 19:40',
            origin: 'Rodoviária do Plano Piloto',
            destination: 'Colônia Agrícola Samambaia, Chácara 102 (Rua de Terra)',
            price: 28.90,
            driver: 'Marcos Vinicius (Toyota Etios)',
            category: 'Rota Nova Comfort',
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

  const addClientCompletedTrip = (newTrip) => {
    if (!currentUser || currentUser.role !== 'cliente') return;
    const currentHistory = currentUser.stats?.tripHistory || [];
    const updatedHistory = [newTrip, ...currentHistory];
    const newTotalSpent = updatedHistory.reduce((acc, t) => acc + (typeof t.price === 'number' ? t.price : parseFloat(t.price) || 0), 0);

    const updatedUser = {
      ...currentUser,
      stats: {
        ...(currentUser.stats || {}),
        totalSpent: newTotalSpent,
        ridesCompleted: updatedHistory.length,
        tripHistory: updatedHistory
      }
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('rotanova_cliente_user', JSON.stringify(updatedUser));
  };

  const completeDriverTrip = (rideData = {}) => {
    if (!currentUser || currentUser.role !== 'motorista') return;
    const priceStr = rideData.price ? String(rideData.price).replace('R$', '').replace('.', '').replace(',', '.').trim() : '38.40';
    const grossVal = parseFloat(priceStr) || 38.40;
    const feeVal = Number((grossVal * 0.10).toFixed(2));
    const fuelVal = Number((grossVal * 0.20).toFixed(2));
    const netVal = Number((grossVal - feeVal - fuelVal).toFixed(2));

    const prevStats = currentUser.stats || {};
    const newGross = Number(((prevStats.grossEarnings || 0) + grossVal).toFixed(2));
    const newFee = Number(((prevStats.platformFee || 0) + feeVal).toFixed(2));
    const newFuel = Number(((prevStats.fuelEstimate || 0) + fuelVal).toFixed(2));
    const newNet = Number(((prevStats.netProfit || 0) + netVal).toFixed(2));
    const newRides = (prevStats.ridesCompleted || 0) + 1;
    const newHours = (prevStats.hoursOnline || 0) + 1;

    const updatedUser = {
      ...currentUser,
      stats: {
        ...prevStats,
        grossEarnings: newGross,
        platformFee: newFee,
        fuelEstimate: newFuel,
        netProfit: newNet,
        ridesCompleted: newRides,
        hoursOnline: newHours
      }
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('rotanova_motorista_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loginAsCliente, 
      loginAsMotorista, 
      completeInterview, 
      addClientCompletedTrip, 
      completeDriverTrip, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
