'use client'

import { useState, useEffect } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StableCoin } from '@/types/stablecoin'
import Image from 'next/image'

export function StablecoinList() {
  const { connection } = useConnection()
  const [stablecoins, setStablecoins] = useState<StableCoin[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStablecoins = async () => {
      // This would be replaced with actual program account fetching
      const accounts = await connection.getProgramAccounts(PROGRAM_ID)
      const coins = accounts.map((account) => {
        // Parse account data into StableCoin interface
        return {
          address: account.pubkey.toString(),
          // ... parse other fields
        }
      })
      setStablecoins(coins)
      setIsLoading(false)
    }

    fetchStablecoins()
  }, [connection])

  if (isLoading) {
    return <div>Loading stablecoins...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stablecoins.map((coin) => (
        <Card key={coin.address}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Image
                src={coin.icon}
                alt={coin.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <CardTitle>{coin.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{coin.symbol}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Target Currency:</span>
                <span>{coin.targetCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Supply:</span>
                <span>{coin.totalSupply.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Exchange Rate:</span>
                <span>1 {coin.symbol} = 1 {coin.targetCurrency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}