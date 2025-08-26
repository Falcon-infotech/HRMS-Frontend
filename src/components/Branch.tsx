import { ArrowLeftCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Users from './Users'
import OrganizationSetup from './OrganizationSetup'

const Branch = () => {
  const navigate = useNavigate()

  const tabs = [
    { id: 1, name: 'Organization Setup' },
    // { id: 2, name: 'Users' },
  ]

  const [activeTab, setActiveTab] = useState(tabs[0].name)

  return (
    <div className="w-full">
      {/* Header with Back Button and Tabs */}
      {/* <div className="h-12 bg-gray-600 rounded flex items-center px-4">
        <ArrowLeftCircle
          className="text-white w-7 h-7 cursor-pointer hover:text-sky-500 transition duration-300"
          onClick={() => navigate(-1)}
        />

        <div className="flex gap-6 text-xl ml-6">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`cursor-pointer pb-1 border-b-4 transition duration-200 ${
                activeTab === tab.name
                  ? 'text-sky-500 border-sky-500'
                  : 'text-white border-transparent hover:text-sky-300'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
            </div>
          ))}
        </div>
      </div> */}

      {/* Tab Content */}
      <div className="">
        {activeTab === 'Organization Setup' && <Users />}
        {/* {activeTab === 'Users' && <OrganizationSetup />} */}
      </div>
    </div>
  )
}

export default Branch
