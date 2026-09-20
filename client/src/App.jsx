import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import Loading from './pages/Loading'
import Login from './pages/Login'
import { assets } from './assets/assets'
import './assets/prism.css'
import { useAppContext } from './context/AppContext'

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user } = useAppContext()

    return (
        <Routes>

            {/* Login page */}
            <Route
                path='/login'
                element={
                    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
                        <Login />
                    </div>
                }
            />

            {/* Main application */}
            <Route
                path='*'
                element={
                    <div className='dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white'>
                        <div className='flex h-screen w-screen'>

                            {!isMenuOpen && (
                                <img
                                    src={assets.menu_icon}
                                    className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert'
                                    onClick={() => setIsMenuOpen(true)}
                                    alt=''
                                />
                            )}

                            <Sidebar
                                isMenuOpen={isMenuOpen}
                                setIsMenuOpen={setIsMenuOpen}
                            />

                            <Routes>
                                <Route path='/' element={<ChatBox />} />
                                <Route path='/credits' element={<Credits />} />
                                <Route path='/community' element={<Community />} />
                                <Route path='/loading' element={<Loading />} />
                            </Routes>

                        </div>
                    </div>
                }
            />

        </Routes>
    )
}

export default App