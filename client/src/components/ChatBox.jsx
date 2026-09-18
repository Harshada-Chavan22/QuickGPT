import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'

const ChatBox = () => {
  const containerRef = React.useRef(null)
  const {selectedChat, theme}= useAppContext()

  const [messages, setMessages] = useState([])
  const[loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('image')
  const [isPublished, setIsPublished] = useState(true)

  const onSubmit = async (e) => {
    e.preventDefault()
    // Handle form submission logic here
  }
  useEffect(()=>{
    if(selectedChat)
    {
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current)
    {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight, 
        behavior: 'smooth',
      })
    }
  },[messages])
  return (
    <div ref={containerRef} className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      {/* Chat Messages */}
      <div className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68'/>
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything.</p>
          </div>
      )}
      {messages.map((message, index)=> <Message key={index} message={message}/>)}
      {/*Three Dots Loading Animation*/}
      {
        loading && <div className= 'loader flex items-center gap-1.5'>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
        </div>
      }
      </div>
      <div className='w-full max-w-2xl mx-auto'>
  {mode === 'image' && (
    <label className='flex items-center justify-center gap-2 mb-3 text-sm'>
      <input
        type="checkbox"
        className='cursor-pointer'
        checked={isPublished}
        onChange={(e) => setIsPublished(e.target.checked)}
      />
      <span className='text-xs'>
        Publish Generated Image to Community
      </span>
    </label>
  )}

  <form
    onSubmit={onSubmit}
    className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full p-3 pl-4 flex gap-4 items-center'
  >
    <select
      onChange={(e) => setMode(e.target.value)}
      value={mode}
      className='text-sm pl-3 pr-2 outline-none'
    >
      <option className='dark:bg-purple-900' value="text">
        Text
      </option>

      <option className='dark:bg-purple-900' value="image">
        Image
      </option>
    </select>

    <input
      type="text"
      placeholder="Type your prompt here..."
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      className='flex-1 w-full text-sm outline-none'
      required
    />

    <button disabled={loading}>
      <img
        src={loading ? assets.stop_icon : assets.send_icon}
        className='w-8 cursor-pointer'
        alt=""
      />
    </button>
  </form>
</div>
      
    </div>
  )
}

export default ChatBox