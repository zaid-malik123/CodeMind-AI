import React from 'react'
import ChatBar from '@/components/ChatBar'

const SelectedChat = async ({params}: {params: Promise<{repoId: string, chatId: string}>}) => {
  const {repoId, chatId} = await params;
  
  return (
    <div>
      <ChatBar repoId={repoId} chatId={chatId} />
    </div>
  )
}

export default SelectedChat