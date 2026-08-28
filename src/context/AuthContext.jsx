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
    } else if (activeRole === 'admin') {
      const saved = localStorage.getItem('rotanova_admin_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved admin user", e);
        }
      }
    }
    return null;
  });

  // Default system drivers list for admin view and management
  const [driversList, setDriversList] = useState(() => {
    const saved = localStorage.getItem('rotanova_drivers_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse drivers list", e);
      }
    }
    return [
      {
        id: 'drv-101',
        name: 'Roberto Barbosa',
        email: 'roberto@rotanova.com.br',
        phone: '(61) 98765-4321',
        carModel: 'Toyota Etios Sedan 1.5 (2021)',
        carPlate: 'ABC-5E67',
        cnh: '09876543210',
        interviewPassed: true,
        interviewScore: 100,
        status: 'Aprovado',
        ridesCompleted: 58,
        rating: 4.98,
        joinedDate: '12/05/2026',
        region: 'Sol Nascente / Ceilândia'
      },
      {
        id: 'drv-102',
        name: 'Carlos Eduardo Silva',
        email: 'carlos.silva@rotanova.com.br',
        phone: '(61) 99123-8877',
        carModel: 'Toyota Corolla 2.0 (2022)',
        carPlate: 'JKL-9812',
        cnh: '12345678901',
        interviewPassed: true,
        interviewScore: 95,
        status: 'Aprovado',
        ridesCompleted: 142,
        rating: 4.99,
        joinedDate: '10/01/2026',
        region: 'Taguatinga / Samambaia'
      },
      {
        id: 'drv-103',
        name: 'Luciana Costa',
        email: 'luciana.costa@gmail.com',
        phone: '(61) 98443-1122',
        carModel: 'Hyundai HB20 1.6 (2020)',
        carPlate: 'FGH-4411',
        cnh: '87654321099',
        interviewPassed: false,
        interviewScore: 85,
        status: 'Pendente',
        ridesCompleted: 0,
        rating: 5.00,
        joinedDate: 'Hoje às 10:15',
        region: 'Colônia Agrícola Samambaia'
      },
      {
        id: 'drv-104',
        name: 'Marcos Vinicius Santos',
        email: 'marcos.v@hotmail.com',
        phone: '(61) 99334-7788',
        carModel: 'Nissan Versa 1.6 (2023)',
        carPlate: 'MNO-3321',
        cnh: '54321678900',
        interviewPassed: true,
        interviewScore: 100,
        status: 'Aprovado',
        ridesCompleted: 89,
        rating: 4.95,
        joinedDate: '02/04/2026',
        region: 'Ceilândia / Sol Nascente'
      },
      {
        id: 'drv-105',
        name: 'Diego Fernandes',
        email: 'diego.fernandes@outlook.com',
        phone: '(61) 98877-6655',
        carModel: 'Chevrolet Onix Plus 1.0T (2022)',
        carPlate: 'PQR-7788',
        cnh: '99887766554',
        interviewPassed: false,
        interviewScore: 70,
        status: 'Pendente',
        ridesCompleted: 0,
        rating: 5.00,
        joinedDate: 'Ontem às 16:40',
        region: 'Recanto das Emas'
      },
      {
        id: 'drv-106',
        name: 'Patricia Albuquerque',
        email: 'patricia.alb@gmail.com',
        phone: '(61) 99655-4433',
        carModel: 'Honda City LX 1.5 (2021)',
        carPlate: 'STU-1122',
        cnh: '66554433221',
        interviewPassed: true,
        interviewScore: 90,
        status: 'Aprovado',
        ridesCompleted: 34,
        rating: 4.92,
        joinedDate: '15/06/2026',
        region: 'Sol Nascente Trecho 3'
      }
    ];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rotanova_active_role', currentUser.role);
      if (currentUser.role === 'cliente') {
        localStorage.setItem('rotanova_cliente_user', JSON.stringify(currentUser));
      } else if (currentUser.role === 'motorista') {
        localStorage.setItem('rotanova_motorista_user', JSON.stringify(currentUser));
      } else if (currentUser.role === 'admin') {
        localStorage.setItem('rotanova_admin_user', JSON.stringify(currentUser));
      }
    } else {
      localStorage.removeItem('rotanova_active_role');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rotanova_drivers_list', JSON.stringify(driversList));
  }, [driversList]);

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

  const loginAsAdmin = (data = {}) => {
    const user = {
      id: `usr_adm_${Date.now()}`,
      name: data.name || 'Administrador RotaNova',
      email: data.email || 'gestao@rotanova.com.br',
      role: 'admin',
      isDemo: true,
      title: 'Direção Geral de Operações'
    };
    setCurrentUser(user);
    return user;
  };

  const approveDriver = (driverId) => {
    setDriversList((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status: 'Aprovado', interviewPassed: true } : d))
    );
  };

  const toggleDriverStatus = (driverId) => {
    setDriversList((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const nextStatus = d.status === 'Aprovado' ? 'Suspenso' : 'Aprovado';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
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
      driversList,
      loginAsCliente, 
      loginAsMotorista, 
      loginAsAdmin,
      approveDriver,
      toggleDriverStatus,
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
