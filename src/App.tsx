import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navigation } from './components/Navigation.tsx';
import { AppSidebar } from './components/AppSidebar.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { Footer } from './components/Footer.tsx';
import { Toast } from './components/Toast.tsx';
import { ShoppingBagDrawer } from './components/ShoppingBagDrawer.tsx';
import { ProductCompareModal } from './components/ProductCompareModal.tsx';
import { AuthModal } from './screens/AuthModal.tsx';

// 15 Comprehensive Screens
import { LandingPage } from './screens/LandingPage.tsx';
import { SkinAnalysisUploadScreen } from './screens/SkinAnalysisUploadScreen.tsx';
import { SkinAnalysisResultsScreen } from './screens/SkinAnalysisResultsScreen.tsx';
import { DashboardScreen } from './screens/DashboardScreen.tsx';
import { RoutineStudioScreen } from './screens/RoutineStudioScreen.tsx';
import { ProductDiscoveryScreen } from './screens/ProductDiscoveryScreen.tsx';
import { ProductDetailsScreen } from './screens/ProductDetailsScreen.tsx';
import { IngredientIntelligenceScreen } from './screens/IngredientIntelligenceScreen.tsx';
import { VirtualStudioScreen } from './screens/VirtualStudioScreen.tsx';
import { BeautyJournalScreen } from './screens/BeautyJournalScreen.tsx';
import { BudgetGuardianScreen } from './screens/BudgetGuardianScreen.tsx';
import { BeautyAssistantScreen } from './screens/BeautyAssistantScreen.tsx';
import { UserProfileScreen } from './screens/UserProfileScreen.tsx';
import { SettingsAndPrivacyScreen } from './screens/SettingsAndPrivacyScreen.tsx';

const MainRouter: React.FC = () => {
  const { currentScreen } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <LandingPage />;
      case 'skin-upload':
        return <SkinAnalysisUploadScreen />;
      case 'skin-results':
        return <SkinAnalysisResultsScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'routines':
        return <RoutineStudioScreen />;
      case 'products':
        return <ProductDiscoveryScreen />;
      case 'product-detail':
        return <ProductDetailsScreen />;
      case 'ingredients':
        return <IngredientIntelligenceScreen />;
      case 'virtual-studio':
        return <VirtualStudioScreen />;
      case 'journal':
        return <BeautyJournalScreen />;
      case 'budget-guardian':
        return <BudgetGuardianScreen />;
      case 'assistant':
        return <BeautyAssistantScreen />;
      case 'profile':
        return <UserProfileScreen />;
      case 'privacy':
        return <SettingsAndPrivacyScreen />;
      default:
        return <LandingPage />;
    }
  };

  const isStorefront = currentScreen === 'home';

  return (
    <div className="min-h-screen bg-[#F8F4ED] text-[#302B27] font-sans antialiased selection:bg-[#C6A77D]/30 selection:text-[#302B27]">
      {isStorefront ? (
        // Editorial Storefront Layout
        <div className="flex flex-col justify-between min-h-screen">
          <div>
            <Navigation />
            <main>
              {renderActiveScreen()}
            </main>
          </div>
          <Footer />
        </div>
      ) : (
        // International Beauty-Tech Platform Layout (Sidebar + Top Bar + Responsive Workspaces)
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Navigation />
            <main className="flex-1 pb-20 lg:pb-12">
              {renderActiveScreen()}
            </main>
            <Footer />
          </div>
          <MobileBottomNav />
        </div>
      )}

      {/* Global Modals & Drawers */}
      <ShoppingBagDrawer />
      <ProductCompareModal />
      <AuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
