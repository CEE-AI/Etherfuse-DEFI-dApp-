'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export function WalletConnect() {
  const { connected, connecting, disconnect } = useWallet()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (connecting) {
      toast({
        title: 'Connecting wallet...',
      })
    }
  }, [connecting, toast])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
      {connected && (
        <Button variant="outline" onClick={() => disconnect()}>
          Disconnect
        </Button>
      )}
    </div>
  )
}