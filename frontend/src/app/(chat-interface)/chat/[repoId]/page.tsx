import ChatBar from '@/components/ChatBar'
import React from 'react'

const ChatInterface = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {

  const { id } = await params;


  return (
    <div>
      <ChatBar repoId={id} />
    </div>
  )
}

export default ChatInterface;