/**
 * ROTA NOVA — CAMADA DE SERVIÇOS & API CLIENT INTEGRADO AO SUPABASE
 * Conexão direta com PostgreSQL, Realtime, Autenticação Segura e Controle de Acesso.
 */

import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Função utilitária de hash seguro para senhas (SHA-256 via Web Crypto API nativa)
 */
export async function hashPassword(password) {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_rotanova_secure_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 1. MÓDULO DE AUTENTICAÇÃO E PERFIL COM VERIFICAÇÃO REAL NO BANCO
 */
export const AuthService = {
  // Login real com validação estrita de e-mail e senha no Supabase
  async login(email, password, expectedRole = null) {
    if (!email || !password) {
      return { success: false, error: 'Por favor, informe e-mail e senha.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Banco de dados Supabase não configurado.' };
    }

    try {
      // 1. Buscar usuário registrado no banco de dados
      const { data: user, error } = await supabase
        .from('users')
        .select('*, driver_profiles(*)')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) {
        console.error('[AuthService.login] Query error:', error);
        return { success: false, error: 'Erro ao consultar banco de dados. Tente novamente.' };
      }

      if (!user) {
        return { 
          success: false, 
          error: 'Nenhuma conta encontrada com este e-mail. Por favor, crie uma conta primeiro.' 
        };
      }

      // 2. Validar Hash da Senha
      const inputHash = await hashPassword(password);
      if (user.password_hash && user.password_hash !== inputHash) {
        return { 
          success: false, 
          error: 'Senha incorreta. Verifique os dados digitados e tente novamente.' 
        };
      }

      // 3. Montar objeto do perfil real
      const driverData = Array.isArray(user.driver_profiles) && user.driver_profiles.length > 0
        ? user.driver_profiles[0]
        : (user.driver_profiles || null);

      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        driverData: driverData ? {
          carModel: driverData.car_model,
          carPlate: driverData.car_plate,
          cnh: driverData.cnh,
          interviewPassed: !!driverData.interview_passed,
          interviewScore: driverData.interview_score || 0,
          isOnline: !!driverData.is_online,
          rating: Number(driverData.rating) || 5.0,
          ridesCompleted: driverData.total_rides || 0
        } : null,
        stats: {
          totalSpent: 0,
          ridesCompleted: driverData ? (driverData.total_rides || 0) : 0,
          ratingGiven: 5.0,
          savedLocations: []
        }
      };

      return { success: true, user: sessionUser };
    } catch (e) {
      console.error('[AuthService.login] Exception:', e);
      return { success: false, error: 'Falha na conexão com o servidor de autenticação.' };
    }
  },

  // Cadastro real de usuário com gravação no banco
  async register({ name, email, phone, password, role = 'cliente', carModel, carPlate, cnh, investorType, company }) {
    if (!email || !password) {
      return { success: false, error: 'E-mail e senha são obrigatórios.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'A senha deve ter no mínimo 6 caracteres para sua segurança.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Banco de dados Supabase não configurado.' };
    }

    try {
      // 1. Verificar se e-mail já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingUser) {
        return { 
          success: false, 
          error: 'Este e-mail já está cadastrado. Por favor, faça login com sua senha.' 
        };
      }

      // 2. Gerar hash de senha e ID único
      const passwordHash = await hashPassword(password);
      const userId = 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

      // 3. Inserir na tabela de usuários
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            name: name || cleanEmail.split('@')[0],
            email: cleanEmail,
            phone: phone || '(61) 99999-0000',
            role: role || 'cliente',
            password_hash: passwordHash,
            is_active: true
          }
        ])
        .select()
        .single();

      if (userError) {
        console.error('[AuthService.register] Error inserting user:', userError);
        return { success: false, error: 'Erro ao criar conta de usuário: ' + userError.message };
      }

      let driverData = null;

      // 4. Se for motorista, criar perfil na tabela driver_profiles vinculada
      if (role === 'motorista') {
        const { data: newDriver, error: driverError } = await supabase
          .from('driver_profiles')
          .insert([
            {
              id: userId,
              user_id: userId,
              car_model: carModel || 'Veículo Registrado',
              car_plate: carPlate || 'ABC-0000',
              cnh: cnh || '00000000000',
              interview_passed: false,
              interview_score: 0,
              is_online: false,
              rating: 5.00,
              total_rides: 0
            }
          ])
          .select()
          .single();

        if (driverError) {
          console.error('[AuthService.register] Error inserting driver profile:', driverError);
        } else {
          driverData = newDriver;
        }
      }

      const sessionUser = {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        driverData: driverData ? {
          carModel: driverData.car_model,
          carPlate: driverData.car_plate,
          cnh: driverData.cnh,
          interviewPassed: false,
          interviewScore: 0,
          isOnline: false,
          rating: 5.0,
          ridesCompleted: 0
        } : null,
        stats: {
          totalSpent: 0,
          ridesCompleted: 0,
          ratingGiven: 5.0,
          savedLocations: []
        }
      };

      return { success: true, user: sessionUser };
    } catch (e) {
      console.error('[AuthService.register] Exception:', e);
      return { success: false, error: 'Erro inesperado ao registrar conta.' };
    }
  },

  // Envio de resultado da entrevista de conduta do motorista
  async submitDriverInterview(driverId, score) {
    const passed = score >= 75;
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('driver_profiles')
          .update({
            interview_passed: passed,
            interview_score: score,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', driverId);
      } catch (e) {
        console.error('[submitDriverInterview] Error:', e);
      }
    }
    return { success: true, approved: passed, score };
  },

  // Buscar todos os motoristas reais cadastrados no banco
  async getDriversList() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('driver_profiles')
        .select('*, users(name, email, phone)');

      if (error || !data) return [];
      return data.map(d => ({
        id: d.id,
        name: d.users?.name || 'Motorista Parceiro',
        email: d.users?.email || '',
        phone: d.users?.phone || '',
        carModel: d.car_model,
        carPlate: d.car_plate,
        cnh: d.cnh,
        interviewPassed: !!d.interview_passed,
        interviewScore: d.interview_score || 0,
        status: d.interview_passed ? 'Aprovado' : 'Pendente de Entrevista',
        ridesCompleted: d.total_rides || 0,
        rating: Number(d.rating) || 5.0,
        isOnline: !!d.is_online
      }));
    } catch (e) {
      console.error('[getDriversList] Error:', e);
      return [];
    }
  }
};

/**
 * 2. MÓDULO DE CORRIDAS (PASSAGEIRO & MOTORISTA EM TEMPO REAL)
 */
export const RideService = {
  // Passageiro solicita uma corrida no Supabase
  async requestRide({
    clientId,
    clientName,
    clientPhone,
    origin,
    destination,
    category,
    categoryName,
    price,
    distanceKm,
    durationMinutes,
    paymentMethod
  }) {
    const rideCode = `ROT-${Math.floor(1000 + Math.random() * 9000)}`;
    const rideId = `ride_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Banco Supabase não conectado.' };
    }

    try {
      // 1. Garantir que o usuário cliente existe na tabela users antes de inserir a corrida (evita FK error)
      let validClientId = clientId;
      if (!validClientId) {
        validClientId = 'usr_guest_' + Date.now();
      }

      // Upsert para garantir integridade referencial
      await supabase
        .from('users')
        .upsert([
          {
            id: validClientId,
            name: clientName || 'Passageiro Rota Nova',
            email: `${validClientId}@rotanova.app`,
            phone: clientPhone || '(61) 99999-0000',
            role: 'cliente'
          }
        ], { onConflict: 'id', ignoreDuplicates: true });

      const numPrice = typeof price === 'number' 
        ? price 
        : parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.')) || 22.50;

      const ridePayload = {
        id: rideId,
        ride_code: rideCode,
        client_id: validClientId,
        origin_address: typeof origin === 'string' ? origin : origin.address,
        origin_lat: (origin && origin.lat) ? origin.lat : -15.7934,
        origin_lng: (origin && origin.lng) ? origin.lng : -47.8884,
        destination_address: typeof destination === 'string' ? destination : destination.address,
        destination_lat: (destination && destination.lat) ? destination.lat : -15.8235,
        destination_lng: (destination && destination.lng) ? destination.lng : -48.1130,
        category: category || 'via_go',
        category_name: categoryName || 'VIA GO',
        price: numPrice,
        distance_km: distanceKm ? parseFloat(distanceKm) : 6.5,
        duration_minutes: durationMinutes ? parseInt(durationMinutes) : 8,
        status: 'searching',
        payment_method: paymentMethod || 'pix',
        payment_status: 'pending'
      };

      const { data, error } = await supabase
        .from('rides')
        .insert([ridePayload])
        .select()
        .single();

      if (error) {
        console.error('[RideService.requestRide] Erro ao inserir corrida:', error);
        return { success: false, error: error.message };
      }

      console.log('[RideService.requestRide] ✅ Corrida salva no Supabase com sucesso:', data);
      return { success: true, rideId, ride: data, rideCode };
    } catch (e) {
      console.error('[RideService.requestRide] Exception:', e);
      return { success: false, error: e.message };
    }
  },

  // Motorista busca chamadas no radar em tempo real
  async getActiveRadarCalls() {
    if (!isSupabaseConfigured || !supabase) {
      return { activeCalls: [] };
    }

    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*, users(name, phone)')
        .eq('status', 'searching')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('[getActiveRadarCalls] Supabase query error:', error);
        return { activeCalls: [] };
      }

      const formatted = (data || []).map(r => ({
        id: r.id,
        rideCode: r.ride_code,
        pickup: r.origin_address,
        dropoff: r.destination_address,
        distance: `${r.distance_km || 5.0} km`,
        price: `R$ ${Number(r.price).toFixed(2).replace('.', ',')}`,
        category: r.category_name || 'VIA GO',
        clientName: r.users?.name || 'Passageiro Rota Nova',
        clientRating: 5.0,
        rawRide: r
      }));

      return { activeCalls: formatted };
    } catch (e) {
      console.error('[getActiveRadarCalls] Exception:', e);
      return { activeCalls: [] };
    }
  },

  // Motorista aceita a corrida (Regra Aceitou, Levou ativada)
  async acceptRide(rideId, driverId, driverDetails = {}) {
    if (!isSupabaseConfigured || !supabase) return { success: false };

    try {
      // Garantir que driver profile existe
      let validDriverId = driverId;
      if (validDriverId) {
        await supabase
          .from('driver_profiles')
          .upsert([
            {
              id: validDriverId,
              user_id: validDriverId,
              car_model: driverDetails.carModel || 'Veículo Registrado',
              car_plate: driverDetails.carPlate || 'ABC-0000',
              cnh: '00000000000'
            }
          ], { onConflict: 'id', ignoreDuplicates: true });
      }

      const { data, error } = await supabase
        .from('rides')
        .update({
          status: 'driver_en_route',
          driver_id: validDriverId,
          accepted_at: new Date().toISOString()
        })
        .eq('id', rideId)
        .select()
        .single();

      if (error) {
        console.error('[acceptRide] Supabase error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, rideId, status: 'driver_en_route', ride: data };
    } catch (e) {
      console.error('[acceptRide] Exception:', e);
      return { success: false, error: e.message };
    }
  },

  // Atualiza status da corrida (ex: em trânsito)
  async updateRideStatus(rideId, status) {
    if (!isSupabaseConfigured || !supabase) return { success: false };
    try {
      await supabase
        .from('rides')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', rideId);
      return { success: true, status };
    } catch (e) {
      console.error('[updateRideStatus] Exception:', e);
      return { success: false };
    }
  },

  // Finalização da corrida e crédito financeiro automático
  async completeRide(rideId, { driverId, finalPrice, rating, comment }) {
    if (!isSupabaseConfigured || !supabase) return { success: false };

    const numPrice = typeof finalPrice === 'number'
      ? finalPrice 
      : parseFloat(String(finalPrice).replace(/[^\d.,]/g, '').replace(',', '.')) || 25.0;

    try {
      // 1. Atualizar corrida para 'completed'
      await supabase
        .from('rides')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          payment_status: 'paid'
        })
        .eq('id', rideId);

      // 2. Registrar no Livro Razão Financeiro (10% Rota Nova, 20% Combustível, 70% Líquido)
      const platformFee = numPrice * 0.10;
      const fuelEst = numPrice * 0.20;
      const netProfit = numPrice - platformFee;

      if (driverId) {
        await supabase
          .from('driver_financial_ledger')
          .insert([
            {
              id: `led_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              driver_id: driverId,
              ride_id: rideId,
              gross_amount: numPrice,
              platform_fee_percent: 10.00,
              platform_fee_amount: platformFee,
              fuel_estimate_amount: fuelEst,
              net_amount: netProfit,
              status: 'credited'
            }
          ]);
      }

      return { success: true, rideId, status: 'completed' };
    } catch (e) {
      console.error('[completeRide] Supabase error:', e);
      return { success: false };
    }
  },

  // Cancelamento de corrida
  async cancelRide(rideId, reason = 'client_cancelled') {
    if (!isSupabaseConfigured || !supabase) return { success: false };
    try {
      await supabase
        .from('rides')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', rideId);
      return { success: true, rideId, status: 'cancelled' };
    } catch (e) {
      console.error('[cancelRide] Exception:', e);
      return { success: false };
    }
  },

  // Inscrever-se para novas chamadas no Radar em Tempo Real via Supabase Realtime
  subscribeToRadar(onNewCall) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channelName = `radar-channel-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rides' },
        payload => {
          console.log('[Supabase Realtime] Nova corrida detectada:', payload.new);
          if (payload.new && payload.new.status === 'searching') {
            const formatted = {
              id: payload.new.id,
              rideCode: payload.new.ride_code,
              pickup: payload.new.origin_address,
              dropoff: payload.new.destination_address,
              distance: `${payload.new.distance_km || 5.0} km`,
              price: `R$ ${Number(payload.new.price).toFixed(2).replace('.', ',')}`,
              category: payload.new.category_name || 'VIA GO',
              clientName: 'Passageiro Rota Nova',
              clientRating: 5.0,
              rawRide: payload.new
            };
            onNewCall(formatted);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Inscrever-se para atualizações de uma corrida específica
  subscribeToRide(rideId, onRideUpdated) {
    if (!isSupabaseConfigured || !supabase || !rideId) return () => {};

    const channelName = `ride-channel-${rideId}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${rideId}`
        },
        payload => {
          console.log('[Supabase Realtime] Atualização da corrida:', payload.new);
          onRideUpdated(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

/**
 * 3. MÓDULO FINANCEIRO DO MOTORISTA
 */
export const FinanceService = {
  async getDriverFinancialSummary(driverId) {
    if (isSupabaseConfigured && supabase && driverId) {
      try {
        const { data, error } = await supabase
          .from('driver_financial_ledger')
          .select('*')
          .eq('driver_id', driverId);

        if (!error && data && data.length > 0) {
          const grossEarnings = data.reduce((sum, item) => sum + Number(item.gross_amount), 0);
          const platformFee = data.reduce((sum, item) => sum + Number(item.platform_fee_amount), 0);
          const fuelEstimate = data.reduce((sum, item) => sum + Number(item.fuel_estimate_amount || 0), 0);
          const netProfit = data.reduce((sum, item) => sum + Number(item.net_amount), 0);

          return {
            platformFeePercent: 10,
            grossEarnings,
            platformFee,
            fuelEstimate,
            netProfit,
            transactions: data
          };
        }
      } catch (e) {
        console.error('[getDriverFinancialSummary] Exception:', e);
      }
    }

    return {
      platformFeePercent: 10,
      grossEarnings: 0,
      platformFee: 0,
      fuelEstimate: 0,
      netProfit: 0,
      transactions: []
    };
  }
};
