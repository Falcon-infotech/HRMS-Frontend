import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon, Bell, Lock, Users, Building2,
  DollarSign, Calendar, Mail, Briefcase, ChevronRight
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');



  const settingsSections = [
    {
      id: 'general',
      name: 'General Settings',
      icon: SettingsIcon,
      description: 'Basic company information and preferences',
      settings: [
        { name: 'Dark-mode', value: false },
        { name: 'Location', value: false },
        // { name: 'Time Zone', value: 'UTC-8 (Pacific Time)' },
        // { name: 'Date Format', value: 'MM/DD/YYYY' },
        // { name: 'Currency', value: 'USD ($)' },
        // { name: 'Language', value: 'English' }
      ]
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Configure notification preferences',
      settings: [
        { name: 'Email Notifications', value: false },
        { name: 'Push Notifications', value: false },
        { name: 'SMS Notifications', value: false },
        { name: 'Desktop Notifications', value: false }
      ]
    },
    // {
    //   id: 'security',
    //   name: 'Security',
    //   icon: Lock,
    //   description: 'Security and authentication settings',
    //   settings: [
    //     { name: 'Two-Factor Authentication', value: 'Enabled' },
    //     { name: 'Password Policy', value: 'Strong' },
    //     { name: 'Session Timeout', value: '30 minutes' },
    //     { name: 'Login History', value: 'View' }
    //   ]
    // },
    // {
    //   id: 'roles',
    //   name: 'Roles & Permissions',
    //   icon: Users,
    //   description: 'Manage user roles and access rights',
    //   settings: [
    //     { name: 'Role Management', value: 'Configure' },
    //     { name: 'Permission Groups', value: 'View' },
    //     { name: 'Access Levels', value: 'Manage' }
    //   ]
    // },
    // {
    //   id: 'organization',
    //   name: 'Organization',
    //   icon: Building2,
    //   description: 'Company structure and departments',
    //   settings: [
    //     { name: 'Departments', value: 'Manage' },
    //     { name: 'Locations', value: 'Configure' },
    //     { name: 'Hierarchy', value: 'View' }
    //   ]
    // },
    // {
    //   id: 'payroll',
    //   name: 'Payroll Settings',
    //   icon: DollarSign,
    //   description: 'Configure payroll and compensation',
    //   settings: [
    //     { name: 'Pay Periods', value: 'Monthly' },
    //     { name: 'Tax Settings', value: 'Configure' },
    //     { name: 'Deductions', value: 'Manage' },
    //     { name: 'Payment Methods', value: 'View' }
    //   ]
    // },
    // {
    //   id: 'leave',
    //   name: 'Leave Settings',
    //   icon: Calendar,
    //   description: 'Leave types and policies',
    //   settings: [
    //     { name: 'Leave Types', value: 'Manage' },
    //     { name: 'Holiday Calendar', value: 'Configure' },
    //     { name: 'Leave Policies', value: 'View' }
    //   ]
    // },
    // {
    //   id: 'recruitment',
    //   name: 'Recruitment',
    //   icon: Briefcase,
    //   description: 'Job posting and hiring settings',
    //   settings: [
    //     { name: 'Job Templates', value: 'Manage' },
    //     { name: 'Interview Process', value: 'Configure' },
    //     { name: 'Hiring Workflow', value: 'View' }
    //   ]
    // },
    // {
    //   id: 'email',
    //   name: 'Email Templates',
    //   icon: Mail,
    //   description: 'Customize email notifications',
    //   settings: [
    //     { name: 'Offer Letters', value: 'Edit' },
    //     { name: 'Welcome Emails', value: 'Configure' },
    //     { name: 'Notification Templates', value: 'Manage' }
    //   ]
    // }
  ];


  const [settingState, setSettingState] = useState(() => {
    const initial: Record<string, boolean> = {}
    settingsSections.forEach((section) => {
      section.settings.forEach(setting => {
        initial[setting.name] = setting.value
      })
    })
    return initial
  })

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage system preferences and configurations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
            <nav className="divide-y divide-neutral-200">
              {settingsSections.map(section => (
                <button
                  key={section.id}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left ${activeTab === section.id
                    ? 'bg-primary-50 border-l-4 border-primary-500'
                    : 'hover:bg-neutral-50'
                    }`}
                  onClick={() => setActiveTab(section.id)}
                >
                  <div className="flex items-center">
                    <section.icon
                      className={`h-5 w-5 mr-3 ${activeTab === section.id ? 'text-primary-500' : 'text-neutral-400'
                        }`}
                    />
                    <span className={`text-sm font-medium ${activeTab === section.id ? 'text-primary-700' : 'text-neutral-700'
                      }`}>
                      {section.name}
                    </span>
                  </div>
                  <ChevronRight className={`h-5 w-5 ${activeTab === section.id ? 'text-primary-500' : 'text-neutral-400'
                    }`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {settingsSections.map(section => (
            activeTab === section.id && (
              <div key={section.id} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                  <div className="flex items-center mb-6">
                    <section.icon className="h-6 w-6 text-primary-500 mr-3" />
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-800">{section.name}</h2>
                      <p className="text-neutral-500">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {section.settings.map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-0"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-neutral-800">{setting.name}</h3>
                          {/* <p className="text-sm text-neutral-500">Current value: {setting.value}</p> */}
                        </div>
                        <div onClick={() => setSettingState((prev) => ({
                          ...prev,
                          [setting.name]: !prev[setting.name]
                        }))} className={`w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full p-1 flex items-center cursor-pointer ${settingState[setting.name] ? 'justify-end bg-blue-400' : 'justify-start'
                          }`}>
                          <div className="w-6 h-6 bg-white dark:bg-black rounded-full shadow-md transition-all duration-300"></div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* {section.id === 'general' && (
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">System Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-500">Version</p>
                        <p className="text-sm font-medium">2.5.0</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Last Updated</p>
                        <p className="text-sm font-medium">March 15, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Environment</p>
                        <p className="text-sm font-medium">Production</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Database Size</p>
                        <p className="text-sm font-medium">1.2 GB</p>
                      </div>
                    </div>
                  </div>
                )} */}

                {section.id === 'security' && (
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">Active Sessions</h3>
                    <div className="space-y-4">
                      {[
                        {
                          device: 'Chrome on Windows',
                          ip: '192.168.1.1',
                          location: 'San Francisco, CA',
                          lastActive: '2 minutes ago'
                        },
                        {
                          device: 'Safari on iPhone',
                          ip: '192.168.1.2',
                          location: 'San Francisco, CA',
                          lastActive: '1 hour ago'
                        }
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-neutral-800">{session.device}</p>
                            <p className="text-sm text-neutral-500">
                              {session.ip} • {session.location}
                            </p>
                            <p className="text-xs text-neutral-400">Last active: {session.lastActive}</p>
                          </div>
                          <button className="text-sm text-error-600 hover:text-error-700 font-medium">
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* {section.id === 'notifications' && (
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">Notification Categories</h3>
                    <div className="space-y-4">
                      {[
                        {
                          name: 'Leave Requests',
                          description: 'Notifications for leave applications and approvals',
                          email: true,
                          push: true,
                          sms: false
                        },
                        {
                          name: 'Attendance',
                          description: 'Daily attendance reports and irregularities',
                          email: true,
                          push: false,
                          sms: false
                        },
                        {
                          name: 'Performance Reviews',
                          description: 'Review schedules and feedback',
                          email: true,
                          push: true,
                          sms: true
                        }
                      ].map((category, index) => (
                        <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-neutral-800">{category.name}</h4>
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                              Configure
                            </button>
                          </div>
                          <p className="text-sm text-neutral-500 mb-3">{category.description}</p>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-primary-600"
                                checked={category.email}
                                onChange={() => { }}
                              />
                              <span className="ml-2 text-sm text-neutral-600">Email</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-primary-600"
                                checked={category.push}
                                onChange={() => { }}
                              />
                              <span className="ml-2 text-sm text-neutral-600">Push</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-primary-600"
                                checked={category.sms}
                                onChange={() => { }}
                              />
                              <span className="ml-2 text-sm text-neutral-600">SMS</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;