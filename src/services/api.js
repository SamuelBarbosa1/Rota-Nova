/**
 * ROTA NOVA — CAMADA DE SERVIÇOS & API CLIENT (REST/WEBSOCKET)
 * Este arquivo padroniza as chamadas de API entre a plataforma Web e os aplicativos Mobile (Passageiro e Motorista).
 * Pode ser conectado diretamente a qualquer backend (Node.js/Express, Python/FastAPI, Go, NestJS, Supabase, Firebase).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.rotanova.com.br/v1';

/**
 * 1. MÓDULO DE AUTENTICAÇÃO E PERFIL
 */
export const AuthService = {
  // Login de usuário (Cliente ou Motorista)
  async login(email, password, role) {
    // Exemplo de payload REST para o time de backend
    const payload = { email, password, role };
    console.log('[API POST] /auth/login', payload);
    return { success: true, token: 'mock_jwt_token', role };
  },

  // Cadastro de novo usuário
  async register(userData) {
    console.log('[API POST] /auth/register', userData);
    return { success: true, user: userData };
  },

  // Envio de resultado da entrevista de conduta do motorista
  async submitDriverInterview(driverId, score, answers) {
    console.log(`[API POST] /drivers/${driverId}/interview`, { score, answers });
    return { success: true, approved: score >= 75, score };
  }
};

/**
 * 2. MÓDULO DE CORRIDAS (PASSAGEIRO & MOTORISTA)
 */
export const RideService = {
  // Passageiro solicita uma corrida
  async requestRide({ clientId, origin, destination, category, price, paymentMethod }) {
    const payload = {
      client_id: clientId,
      origin_address: origin.address,
      origin_lat: origin.lat,
      origin_lng: origin.lng,
      destination_address: destination.address,
      destination_lat: destination.lat,
      destination_lng: destination.lng,
      category, // 'via_go' | 'via_plus' | 'via_eco' | 'via_delas' | 'via_black' | 'via_prime' | 'via_box' | 'via_pet'
      price,
      payment_method: paymentMethod,
      requested_at: new Date().toISOString()
    };
    console.log('[API POST] /rides/request', payload);
    return {
      success: true,
      rideId: `ROT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'searching',
      payload
    };
  },

  // Motorista busca chamadas no radar (Polling / WebSocket)
  async getActiveRadarCalls(driverLat, driverLng, radiusKm = 10) {
    console.log(`[API GET] /rides/radar?lat=${driverLat}&lng=${driverLng}&radius=${radiusKm}`);
    return {
      activeCalls: [
        {
          id: `ROT-${Math.floor(1000 + Math.random() * 9000)}`,
          pickup: 'Sol Nascente, Trecho 3, Chácara 28',
          dropoff: 'Taguatinga Centro — Praça do Relógio',
          distance: '6.8 km',
          price: 'R$ 22,50',
          category: 'VIA GO',
          clientName: 'Juliana Mendes',
          clientRating: 4.95
        }
      ]
    };
  },

  // Motorista aceita a corrida (Regra Aceitou, Levou ativada)
  async acceptRide(rideId, driverId) {
    console.log(`[API POST] /rides/${rideId}/accept`, { driver_id: driverId });
    return { success: true, rideId, status: 'in_transit' };
  },

  // Finalização da corrida e crédito financeiro
  async completeRide(rideId, { driverId, finalPrice, rating, comment }) {
    console.log(`[API POST] /rides/${rideId}/complete`, {
      driver_id: driverId,
      final_price: finalPrice,
      rating,
      comment
    });
    return { success: true, rideId, status: 'completed' };
  },

  // Cancelamento de corrida antes do embarque
  async cancelRide(rideId, reason = 'client_cancelled') {
    console.log(`[API POST] /rides/${rideId}/cancel`, { reason });
    return { success: true, rideId, status: 'cancelled' };
  },

  // Registro de exceção mecânica/emergência pelo condutor
  async reportException(rideId, { type, description, photoUrl }) {
    console.log(`[API POST] /rides/${rideId}/exception`, { type, description, photoUrl });
    return { success: true, registered: true, status: 'under_investigation' };
  }
};

/**
 * 3. MÓDULO FINANCEIRO DO MOTORISTA
 */
export const FinanceService = {
  // Obter extrato de repasses e demonstrativo líquido
  async getDriverFinancialSummary(driverId) {
    console.log(`[API GET] /drivers/${driverId}/financial-summary`);
    return {
      platformFeePercent: 10, // 10% fixo
      grossEarnings: 3420.00,
      platformFee: 342.00,
      fuelEstimate: 680.00,
      netProfit: 2398.00
    };
  }
};
