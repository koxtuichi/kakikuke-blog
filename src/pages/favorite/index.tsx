import React from 'react'
import MainTable from '../../components/mainTable'
import Header from '../../components/header'
import MouseCursor from '../../lib/notion/mouseCursor'

function App() {
  return (
    <React.Fragment>
      <Header titlePre="Blog" className="mt-6" />
      <MouseCursor />
      <div className="min-h-screen">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <MainTable />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default App
