import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex"
    // style={{
    //     backgroundImage: `url('bglogin.jpg')`,
    //   }}
    >
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 auth-gradient-bg p-12 flex-col justify-between"
      style={{
        backgroundImage: `url('bglogin.jpg')`,
        backgroundSize: '100% 100%',
      }}
      >
        <div>
          <div className="flex items-center text-white">
            {/* <Building2 size={32} /> */}
               {/* <img
              src="/img.png"
              alt="Falcon HRMS Logo"
              className="w-32 rounded-full" */}
            {/* /> */}
            {/* <h1 className="ml-2 text-2xl font-bold">HRMS</h1> */}
             <h1 className="ml-2 text-2xl font-bold text-gray-600">
              FALCON-HRMS
            </h1>
          </div>
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-600 mb-4">
              Welcome to your Human Resource Management System
            </h2>
            <p className="text-black text-opacity-90 text-lg">
              Streamline your HR processes and empower your team with our comprehensive HRMS platform.
            </p>
          </div>
        </div>
        <div className="text-white text-opacity-80 text-sm">
          © 2025 HRMS. All rights reserved.
        </div>
      </div>

      {/* Right side - auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6" style={{
              // backgroundImage: `url('bglogin.jpg')`,
              // backgroundSize: 'cover',

      }}>
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center justify-center">
            {/* Logo and Title for small screens */}
            {/* <Building2 size={28} className="text-primary-600" /> */}

            <img
              src="/img.png"
              alt="Falcon HRMS Logo"
              className="w-32 rounded-full"
            />
            <h1 className="ml-2 text-2xl font-bold text-[#1C50A3]">
              FALCON-HRMS
            </h1>
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