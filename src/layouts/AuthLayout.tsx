import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 auth-gradient-bg p-12 flex-col justify-between">
        <div>
          <div className="flex items-center text-white">
            <Building2 size={32} />
            <h1 className="ml-2 text-2xl font-bold">HRMS</h1>
          </div>
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to your Human Resource Management System
            </h2>
            <p className="text-white text-opacity-90 text-lg">
              Streamline your HR processes and empower your team with our comprehensive HRMS platform.
            </p>
          </div>
        </div>
        <div className="text-white text-opacity-80 text-sm">
          © 2025 HRMS. All rights reserved.
        </div>
      </div>

      {/* Right side - auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center justify-center">
            <Building2 size={28} className="text-primary-600" />
            <h1 className="ml-2 text-xl font-bold text-primary-600">HRMS</h1>
          </div>
          
          <Outlet />
          
          <div className="mt-8 text-center lg:hidden">
            <p className="text-neutral-500 text-sm">
              © 2025 HRMS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;