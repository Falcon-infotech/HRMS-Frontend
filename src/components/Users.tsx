import { Locate } from 'lucide-react'
import { MdApartment, MdBadge } from 'react-icons/md'
import React, { useState } from 'react'
import Location from './Location'
import Designation from './Designation'
import Department from './Department'

type TabItem = {
  name: string
  icon: React.ElementType
}

const Users = () => {
  const tabs: TabItem[] = [
    { name: 'Location', icon: Locate },
    { name: 'Designation', icon: MdBadge },
    { name: 'Department', icon: MdApartment },
    // Example extra tabs
    // { name: 'Team', icon: MdApartment },
    // { name: 'Role', icon: MdApartment },
    // { name: 'Shift', icon: MdApartment }
  ]

  const [activeTab, setActiveTab] = useState("Location")

  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-white">
      {/* Scrollable Top Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto scrollbar-hide">
        <div className="flex whitespace-nowrap">
          {tabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === name
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300'
              }`}
            >
              {/* <Icon className="w-5 h-5 shrink-0" /> */}
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="flex-1 p-6">
        {activeTab === "Location" && <Location />}
        {activeTab === "Designation" && <Designation />}
        {activeTab === "Department" && <Department />}
        {/* {activeTab === "Team" && <p>Team content here...</p>}
        {activeTab === "Role" && <p>Role content here...</p>}
        {activeTab === "Shift" && <p>Shift content here...</p>} */}
      </main>
    </div>
  )
}

export default Users
