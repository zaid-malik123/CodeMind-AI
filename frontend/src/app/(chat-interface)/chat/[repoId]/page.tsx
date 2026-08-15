import ChatBar from '@/components/ChatBar'
import React from 'react'

const ChatInterface = async ({
  params,
}: {
  params: Promise<{ repoId: string }>
}) => {

  const { repoId } = await params;


  return (
    <div>
      <ChatBar repoId={repoId} />
    </div>
  )
}

export default ChatInterface;