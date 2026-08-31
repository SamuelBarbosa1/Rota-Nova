import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Car, User, ShieldAlert, LogOut, Menu, X, ArrowRight, LayoutDashboard, 
  TrendingUp, Activity, FileCheck, History, Heart, Users, DollarSign, Briefcase, Flame, LogIn, UserPlus,
  BarChart3, FileSpreadsheet
} from 'lucide-react';

export default function BottomNavbar() {
  const { currentUser, activeTab, setActiveTab, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  // Determine active context based on current page first, then user role
  let pageContext = 'cliente';
  if (currentPath === '/admin') {
    pageContext = 'admin';
  } else if (currentPath === '/investidor') {
    pageContext = 'investidor';
  } else if (currentPath === '/motorista') {
    pageContext = 'motorista';
  } else if (currentPath === '/cliente') {
    pageContext = 'cliente';
  } else if (currentUser) {
    pageContext = currentUser.role || 'cliente';
  } else {
    return null;
  }

  // Define tabs based on active page context
  let tabs = [];

  if (pageContext === 'admin') {
    tabs = [
      {
        id: 'visao_geral',
        label: 'Início',
        icon: LayoutDashboard,
      },
      {
        id: 'motoristas',
        label: 'Motoristas',
        icon: Car,
      },
      {
        id: 'faturamento',
        label: 'Caixa 10%',
        icon: DollarSign,
        isCenter: true,
      },
      {
        id: 'corridas',
        label: 'Corridas',
        icon: Activity,
      },
      {
        id: 'menu',
        label: 'Menu',
        icon: Menu,
      }
    ];
  } else if (pageContext === 'investidor') {
    tabs = [
      {
        id: 'metrics',
        label: 'Início',
        icon: Users,
      },
      {
        id: 'extrato',
        label: 'Extrato',
        icon: DollarSign,
      },
      {
        id: 'investir',
        label: 'Apoiar',
        icon: Briefcase,
        isCenter: true,
      },
      {
        id: 'timeline',
        label: 'Timeline',
        icon: Flame,
      },
      {
        id: 'menu',
        label: 'Menu',
        icon: Menu,
      }
    ];
  } else if (pageContext === 'motorista') {
    const isPassed = !!currentUser?.driverData?.interviewPassed;
    tabs = [
      {
        id: 'cockpit',
        label: 'Radar',
        icon: Activity,
      },
      {
        id: 'financeiro',
        label: 'Ganhos',
        icon: DollarSign,
      },
      {
        id: isPassed ? 'cockpit' : 'entrevista',
        label: isPassed ? 'Iniciar' : 'Treino',
        icon: Car,
        isCenter: true,
      },
      {
        id: 'entrevista',
        label: 'Regras',
        icon: FileCheck,
      },
      {
        id: 'menu',
        label: 'Menu',
        icon: Menu,
      }
    ];
  } else {
    tabs = [
      {
        id: 'dash',
        label: 'Início',
        icon: LayoutDashboard,
      },
      {
        id: 'historico',
        label: 'Viagens',
        icon: History,
      },
      {
        id: 'pedir',
        label: 'Chamar VIA',
        icon: Car,
        isCenter: true,
      },
      {
        id: 'favoritos',
        label: 'Favoritos',
        icon: Heart,
      },
      {
        id: 'menu',
        label: 'Menu',
        icon: Menu,
      }
    ];
  }

  const handleTabClick = (tabId) => {
    const targetPath = 
      pageContext === 'admin' ? '/admin' :
      pageContext === 'investidor' ? '/investidor' :
      pageContext === 'motorista' ? '/motorista' : '/cliente';

    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }

    // Special mapping: if role is cliente and tab is favoritos, redirect to 'historico' tab
    if (pageContext === 'cliente' && tabId === 'favoritos') {
      setActiveTab('historico');
      setTimeout(() => {
        const favElement = document.getElementById('meus-favoritos');
        if (favElement) {
          favElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    setActiveTab(tabId);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-900 shadow-2xl px-4 py-2 flex items-center justify-around h-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id || (tab.id === 'favoritos' && activeTab === 'historico');

        if (tab.isCenter) {
          return (
            <button
              key={tab.label}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center relative -top-4 focus:outline-none group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-950/80 border-4 border-slate-950 transform group-hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                <Icon className="w-6 h-6 text-slate-950 font-black" />
              </div>
              <span className="text-[10px] font-bold text-amber-400 mt-1 uppercase tracking-wider">
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.id)}
            className="flex flex-col items-center justify-center w-14 h-full focus:outline-none transition-colors"
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-amber-400 scale-110 font-bold' : 'text-slate-400 hover:text-white'}`} />
            <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
