import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon, Bell, Lock, Users, Building2,
  DollarSign, Calendar, Mail, Briefcase, ChevronRight,
  Palette, Database, Shield, Clock, UserCheck, FileText,
  Download, Upload, Key, Globe, MessageSquare, Eye, EyeOff
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const darkMode = useSelector((state: RootState) => state.settings.data.darkMode);
  const [settingState, setSettingState] = useState<Record<string, boolean>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const settingsSections = [
    {
      id: 'general',
      name: 'General Settings',
      icon: SettingsIcon,
      description: 'Basic company information and preferences',
      settings: [
        { name: 'Dark Mode', value: false, type: 'toggle' },
        { name: 'Company Name', value: 'Your Company Inc.', type: 'text' },
        { name: 'Time Zone', value: 'UTC-8 (Pacific Time)', type: 'dropdown', options: ['UTC-8 (Pacific Time)', 'UTC-5 (Eastern Time)', 'UTC (GMT)'] },
        { name: 'Date Format', value: 'MM/DD/YYYY', type: 'dropdown', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] },
        { name: 'Language', value: 'English', type: 'dropdown', options: ['English', 'Spanish', 'French'] }
      ]
    },
    {
      id: 'appearance',
      name: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of your HRMS',
      settings: [
        { name: 'Theme Color', value: '#2563eb', type: 'color' },
        { name: 'Compact Mode', value: false, type: 'toggle' },
        { name: 'Sidebar Style', value: 'Expanded', type: 'dropdown', options: ['Expanded', 'Compact', 'Icons Only'] },
        { name: 'Font Size', value: 'Medium', type: 'dropdown', options: ['Small', 'Medium', 'Large'] }
      ]
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Configure notification preferences',
      settings: [
        { name: 'Email Notifications', value: true, type: 'toggle' },
        { name: 'Push Notifications', value: true, type: 'toggle' },
        { name: 'SMS Notifications', value: false, type: 'toggle' },
        { name: 'Desktop Notifications', value: true, type: 'toggle' }
      ]
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Security and authentication settings',
      settings: [
        { name: 'Two-Factor Authentication', value: false, type: 'toggle' },
        { name: 'Password Expiry', value: '90 days', type: 'dropdown', options: ['30 days', '60 days', '90 days', 'Never'] },
        { name: 'Session Timeout', value: '30 minutes', type: 'dropdown', options: ['15 minutes', '30 minutes', '1 hour', '4 hours'] },
        { name: 'Login Attempts', value: '5 attempts', type: 'dropdown', options: ['3 attempts', '5 attempts', '10 attempts'] }
      ]
    },
    {
      id: 'authentication',
      name: 'Authentication',
      icon: Key,
      description: 'Manage login and access controls',
      settings: [
        { name: 'Single Sign-On (SSO)', value: false, type: 'toggle' },
        { name: 'LDAP Integration', value: false, type: 'toggle' },
        { name: 'IP Restrictions', value: false, type: 'toggle' },
        { name: 'Device Management', value: true, type: 'toggle' }
      ]
    },
    {
      id: 'roles',
      name: 'Roles & Permissions',
      icon: Users,
      description: 'Manage user roles and access rights',
      settings: [
        { name: 'Role Management', value: 'Configure', type: 'button' },
        { name: 'Permission Groups', value: 'View', type: 'button' },
        { name: 'Access Levels', value: 'Manage', type: 'button' }
      ]
    },
    {
      id: 'organization',
      name: 'Organization',
      icon: Building2,
      description: 'Company structure and departments',
      settings: [
        { name: 'Departments', value: 'Manage', type: 'button' },
        { name: 'Locations', value: 'Configure', type: 'button' },
        { name: 'Hierarchy', value: 'View', type: 'button' },
        { name: 'Company Policies', value: 'Edit', type: 'button' }
      ]
    },
    {
      id: 'payroll',
      name: 'Payroll Settings',
      icon: DollarSign,
      description: 'Configure payroll and compensation',
      settings: [
        { name: 'Pay Periods', value: 'Monthly', type: 'dropdown', options: ['Weekly', 'Bi-weekly', 'Monthly'] },
        { name: 'Tax Settings', value: 'Configure', type: 'button' },
        { name: 'Deductions', value: 'Manage', type: 'button' },
        { name: 'Payment Methods', value: 'View', type: 'button' }
      ]
    },
    {
      id: 'leave',
      name: 'Leave Settings',
      icon: Calendar,
      description: 'Leave types and policies',
      settings: [
        { name: 'Leave Types', value: 'Manage', type: 'button' },
        { name: 'Holiday Calendar', value: 'Configure', type: 'button' },
        { name: 'Leave Policies', value: 'View', type: 'button' },
        { name: 'Carry Forward', value: false, type: 'toggle' }
      ]
    },
    {
      id: 'attendance',
      name: 'Attendance',
      icon: Clock,
      description: 'Attendance tracking settings',
      settings: [
        { name: 'Shift Management', value: 'Configure', type: 'button' },
        { name: 'Overtime Rules', value: 'Manage', type: 'button' },
        { name: 'Geo-Fencing', value: false, type: 'toggle' },
        { name: 'IP-Based Attendance', value: true, type: 'toggle' }
      ]
    },
    {
      id: 'recruitment',
      name: 'Recruitment',
      icon: Briefcase,
      description: 'Job posting and hiring settings',
      settings: [
        { name: 'Job Templates', value: 'Manage', type: 'button' },
        { name: 'Interview Process', value: 'Configure', type: 'button' },
        { name: 'Hiring Workflow', value: 'View', type: 'button' },
        { name: 'Candidate Portal', value: true, type: 'toggle' }
      ]
    },
    {
      id: 'employee',
      name: 'Employee Settings',
      icon: UserCheck,
      description: 'Employee management configurations',
      settings: [
        { name: 'Onboarding Process', value: 'Configure', type: 'button' },
        { name: 'Probation Period', value: '90 days', type: 'dropdown', options: ['30 days', '60 days', '90 days'] },
        { name: 'Employee ID Format', value: 'EMP-#####', type: 'text' },
        { name: 'Self-Service Portal', value: true, type: 'toggle' }
      ]
    },
    {
      id: 'email',
      name: 'Email Templates',
      icon: Mail,
      description: 'Customize email notifications',
      settings: [
        { name: 'Offer Letters', value: 'Edit', type: 'button' },
        { name: 'Welcome Emails', value: 'Configure', type: 'button' },
        { name: 'Notification Templates', value: 'Manage', type: 'button' },
        { name: 'Auto-Responders', value: true, type: 'toggle' }
      ]
    },
    {
      id: 'comms',
      name: 'Communications',
      icon: MessageSquare,
      description: 'Internal communication settings',
      settings: [
        { name: 'Announcements', value: true, type: 'toggle' },
        { name: 'Birthday Alerts', value: true, type: 'toggle' },
        { name: 'Work Anniversary Alerts', value: true, type: 'toggle' },
        { name: 'Broadcast Messages', value: false, type: 'toggle' }
      ]
    },
    {
      id: 'data',
      name: 'Data Management',
      icon: Database,
      description: 'Data import, export and backup settings',
      settings: [
        { name: 'Auto Backup', value: true, type: 'toggle' },
        { name: 'Backup Frequency', value: 'Daily', type: 'dropdown', options: ['Daily', 'Weekly', 'Monthly'] },
        { name: 'Data Export', value: 'Configure', type: 'button' },
        { name: 'Data Retention', value: '5 years', type: 'dropdown', options: ['1 year', '3 years', '5 years', 'Permanent'] }
      ]
    },
    {
      id: 'privacy',
      name: 'Privacy',
      icon: EyeOff,
      description: 'Privacy and data protection settings',
      settings: [
        { name: 'GDPR Compliance', value: true, type: 'toggle' },
        { name: 'Data Anonymization', value: false, type: 'toggle' },
        { name: 'Privacy Policy', value: 'Edit', type: 'button' },
        { name: 'Consent Management', value: 'Manage', type: 'button' }
      ]
    }
  ];

  useEffect(() => {
    const initial: Record<string, any> = {};
    settingsSections.forEach((section) => {
      section.settings.forEach(setting => {
        initial[setting.name] = setting.value;
      });
    });
    setSettingState(initial);
  }, []);

  const handleInputChange = (name: string, value: any) => {
    setSettingState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleSavePassword = () => {
    // Add password change logic here
    console.log('Password change requested', passwordData);
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const renderSettingControl = (setting: any) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div 
            onClick={() => handleInputChange(setting.name, !settingState[setting.name])} 
            className={`w-14 h-8 rounded-full p-1 flex items-center cursor-pointer transition-colors ${
              settingState[setting.name] ? 'bg-blue-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
            }`}
          >
            <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md transition-all duration-300"></div>
          </div>
        );
      
      case 'dropdown':
        return (
          <select 
            value={settingState[setting.name]} 
            onChange={(e) => handleInputChange(setting.name, e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {setting.options.map((option: string, idx: number) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'text':
        return (
          <input 
            type="text"
            value={settingState[setting.name]}
            onChange={(e) => handleInputChange(setting.name, e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        );
      
      case 'color':
        return (
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              style={{ backgroundColor: settingState[setting.name] }}
            ></div>
            <input 
              type="text"
              value={settingState[setting.name]}
              onChange={(e) => handleInputChange(setting.name, e.target.value)}
              className="ml-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
            />
          </div>
        );
      
      case 'button':
        return (
          <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors">
            {setting.value}
          </button>
        );
      
      default:
        return <span className="text-sm text-gray-600 dark:text-gray-400">{setting.value}</span>;
    }
  };

  return (
    <div className="animate-fade-in pb-8">
      <PageHeader
        title="System Settings"
        description="Configure your HRMS platform preferences and settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Settings Categories</h3>
            </div>
            <nav className="divide-y divide-gray-200 dark:divide-gray-700">
              {settingsSections.map(section => (
                <button
                  key={section.id}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                    activeTab === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab(section.id)}
                >
                  <div className="flex items-center">
                    <section.icon
                      className={`h-5 w-5 mr-3 ${
                        activeTab === section.id ? 'text-blue-500' : 'text-gray-400'
                      }`}
                    />
                    <span className={`text-sm font-medium ${
                      activeTab === section.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {section.name}
                    </span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${
                    activeTab === section.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-4">
          {settingsSections.map(section => (
            activeTab === section.id && (
              <div key={section.id} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                        <section.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{section.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{section.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {section.settings.map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white">{setting.name}</h3>
                          {setting.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{setting.description}</p>
                          )}
                        </div>
                        <div className="ml-4">
                          {renderSettingControl(setting)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional content for specific sections */}
                {section.id === 'security' && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Change Password</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange(e, 'currentPassword')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange(e, 'newPassword')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => handlePasswordChange(e, 'confirmPassword')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleSavePassword}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                )}

                {section.id === 'data' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Export Data</h3>
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Export your HR data for backup or external processing.
                        </p>
                        <div className="space-y-3 mb-4">
                          <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Employee Data</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Attendance Records</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Payroll Information</span>
                          </label>
                        </div>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option>CSV Format</option>
                          <option>Excel Format</option>
                          <option>JSON Format</option>
                        </select>
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Download size={18} className="mr-2" />
                          Export Data
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Import Data</h3>
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Import employee data from external sources.
                        </p>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-4">
                          <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Drag & drop files here or click to browse</p>
                          <p className="text-xs text-gray-400 mt-1">CSV, XLSX formats supported</p>
                        </div>
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Upload size={18} className="mr-2" />
                          Import Data
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;