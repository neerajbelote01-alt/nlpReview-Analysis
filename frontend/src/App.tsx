import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReviewAnalyzerPage } from './pages/ReviewAnalyzerPage';
import { BulkAnalysisPage } from './pages/BulkAnalysisPage';
import { ProductCatalogPage } from './pages/ProductCatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AspectAnalyticsPage } from './pages/AspectAnalyticsPage';
import { ProductComparisonPage } from './pages/ProductComparisonPage';
import { ComplaintDiscoveryPage } from './pages/ComplaintDiscoveryPage';
import { ModelEvaluationPage } from './pages/ModelEvaluationPage';
import { DatasetManagementPage } from './pages/DatasetManagementPage';
import { AnalysisHistoryPage } from './pages/AnalysisHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard Layout Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analyzer" element={<ReviewAnalyzerPage />} />
              <Route path="/bulk-analysis" element={<BulkAnalysisPage />} />
              <Route path="/products" element={<ProductCatalogPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/aspects" element={<AspectAnalyticsPage />} />
              <Route path="/compare" element={<ProductComparisonPage />} />
              <Route path="/complaints" element={<ComplaintDiscoveryPage />} />
              <Route path="/model-evaluation" element={<ModelEvaluationPage />} />
              <Route path="/dataset" element={<DatasetManagementPage />} />
              <Route path="/history" element={<AnalysisHistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
