import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rotaja_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    // Default: Unauthenticated (Guest visitor flow)
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rotaja_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rotaja_user');
    }
  }, [currentUser]);

  const loginAsCliente = (data) => {
    const user = {
      id: `usr_c_${Date.now()}`,
      name: data.name || 'Juliana Mendes',
      email: data.email || 'juliana@rotaja.com.br',
      phone: data.phone || '(11) 98765-4321',
      role: 'cliente',
      stats: {
        totalSpent: 489.20,
        ridesCompleted: 18,
        ratingGiven: 4.95,
        savedLocations: [
          { name: 'Casa', address: 'Rua dos Ipês, 28 (Estrada de Chão)' },
          { name: 'Trabalho', address: 'Av. Paulista, 1000 — SP' }
        ]
      }
    };
    setCurrentUser(user);
    return user;
  };

  const loginAsMotorista = (data) => {
    const user = {
      id: `usr_m_${Date.now()}`,
      name: data.name || 'Roberto Barbosa',
      email: data.email || 'roberto@rotaja.com.br',
      phone: data.phone || '(11) 97123-4567',
      role: 'motorista',
      driverData: {
        carModel: data.carModel || 'Toyota Etios Sedan 1.5',
        carPlate: data.carPlate || 'ABC-5E67',
        cnh: data.cnh || '09876543210',
        interviewPassed: true,
        interviewScore: 100
      },
      stats: {
        grossEarnings: 3420.00,
        platformFee: 342.00,
        fuelEstimate: 680.00,
        netProfit: 2398.00,
        ridesCompleted: 58,
        acceptanceRate: 100,
        hoursOnline: 44,
        rating: 4.98
      }
    };
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginAsCliente, loginAsMotorista, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
