import React, { ReactNode } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation/Navgation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <Navigation />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;