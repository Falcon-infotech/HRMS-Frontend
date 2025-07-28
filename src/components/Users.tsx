import { Locate } from 'lucide-react'
import { MdApartment, MdBadge } from 'react-icons/md'
import React, { useState } from 'react'
import Location from './Location'
import Designation from './Designation'
import Department from './Department'
import { Menu } from 'lucide-react'

type SidebarItem = {
  name: string
  icon: React.ElementType
  children?: { name: string }[]
}

const Users = () => {
  const sidebar: SidebarItem[] = [
    { name: 'Location', icon: Locate },
    { name: 'Designation', icon: MdBadge },
    { name: 'Department', icon: MdApartment }
  ]

  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("Location")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleToggle = (name: string) => {
    setOpenDropdown(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-3 md:hidden">
        <h1 className="text-xl font-bold">{activeTab}</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'block' : 'hidden'} 
          md:block 
          w-full md:w-1/5 border-r border-gray-300 bg-gray-50 p-4
        `}
      >
        <nav className="space-y-4">
          {sidebar.map(({ name, icon: Icon, children }) => (
            <div key={name}>
              <button
                className={`w-full flex items-center gap-3 text-left font-semibold hover:text-blue-600 focus:outline-none transition text-lg hover:bg-gray-200 py-2 rounded-xl ${activeTab === name ? "text-primary-600" : "text-gray-700"}`}
                onClick={() => {
                  children && handleToggle(name)
                  setActiveTab(name)
                  setSidebarOpen(false) // Auto-close on mobile
                }}
              >
                <Icon className="w-5 h-5" />
                {name}
              </button>

              {children && openDropdown[name] && (
                <ul className="ml-8 mt-2 space-y-2">
                  {children.map((child) => (
                    <li
                      key={child.name}
                      className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer transition"
                    >
                      {child.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white">
        {activeTab === "Location" && <Location />}
        {activeTab === "Designation" && <Designation />}
        {activeTab === "Department" && <Department />}
      </main>
    </div>
  )
}

export default Users
