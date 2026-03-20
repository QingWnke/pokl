import { createBrowserRouter } from 'react-router-dom';
import { AdminAdsPage } from './admin/AdsPage';
import { AdminCategoriesPage } from './admin/CategoriesPage';
import { AdminDashboardPage } from './admin/DashboardPage';
import { AdminGamesPage } from './admin/GamesPage';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/LoginPage';
import { AdminReviewsPage } from './admin/ReviewsPage';
import { AdminSettingsPage } from './admin/SettingsPage';
import { MainLayout } from './components/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { HomePage } from './pages/HomePage';
import { NewReleasesPage } from './pages/NewReleasesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PopularPage } from './pages/PopularPage';
import { RatingsPage } from './pages/RatingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'ratings', element: <RatingsPage /> },
      { path: 'popular', element: <PopularPage /> },
      { path: 'new', element: <NewReleasesPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'game/:slug', element: <GamePlayPage /> }
    ]
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'games', element: <AdminGamesPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'reviews', element: <AdminReviewsPage /> },
          { path: 'ads', element: <AdminAdsPage /> },
          { path: 'settings', element: <AdminSettingsPage /> }
        ]
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
