import { Locate } from 'lucide-react'
import { MdApartment, MdBadge, MdDesignServices, MdLocalFireDepartment } from 'react-icons/md'
import React, { useState } from 'react'
import Location from './Location'
import Designation from './Designation'
import Department from './Department'

type SidebarItem = {
  name: string
  icon: React.ElementType
  children?: { name: string }[]
}

const Users = () => {
  const sidebar: SidebarItem[] = [
    {
      name: 'Location',
      icon: Locate,
      

    },
    {
      name: 'Designation',
      icon: MdBadge ,

    },
    {
      name: 'Department',
      icon: MdApartment ,

    }
  ]

  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("Location")

  const handleToggle = (name: string) => {
    setOpenDropdown(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <aside className="w-1/5 border-r border-gray-300 bg-gray-50 p-4 min-h-screen">
        <nav className="space-y-4">
          {sidebar.map(({ name, icon: Icon, children }) => (
            <div key={name}>
              <button
                className={`w-full flex items-center gap-3 text-left font-semibold  hover:text-blue-600 focus:outline-none transition text-lg hover:bg-gray-200 py-2 rounded-xl ${activeTab == name ? "text-primary-600" : "text-gray-700"}`}
                onClick={() => {
                  children && handleToggle(name)
                  setActiveTab(name)
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
      <main className="flex-1 p-6">
       { activeTab=="Location" && <Location /> }
       { activeTab=="Designation" && <Designation /> }
       {activeTab=="Department" && <Department /> }
      </main>
    </div>
  )
}

export default Users
