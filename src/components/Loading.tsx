import React from 'react'

const Loading = ({text}) => {
  return (
<div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-600 border-dashed rounded-full animate-spin"></div>
        <p className="text-primary-600 font-medium">{ text}</p>
      </div>
    </div>  )
}

export default Loading