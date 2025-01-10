'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { StableCoin } from '@/types/stablecoin'
import { mintStableCoin, redeemStableCoin } from '@/utils/solana'
import Image from 'next/image'

export default function StablecoinDetail() {
  const params = useParams()
  const { connection } = useConnection()
  const wallet = useWallet()
  const { toast } = useToast()
  const [stablecoin, setStablecoin] = useState<StableCoin | null>(null)
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchStablecoin = async () => {
      // This would be replaced with actual program account fetching
      const account = await connection.getAccountInfo(new PublicKey(params.address))
      // Parse account data into StableCoin interface
      setStablecoin({
        address: params.address,
        // ... parse other fields
      })
    }

    fetchStablecoin()
  }, [connection, params.address])

  const handleMint = async () => {
    if (!wallet.connected || !amount) return
    setIsLoading(true)
    try {
      await mintStableCoin( wallet, params.address.toString(), parseFloat(amount))
      toast({
        title: 'Successfully minted tokens',
        description: `${amount} ${stablecoin?.symbol} minted`
      })
      setAmount('')
    } catch (error: any) {
      toast({
        title: 'Error minting tokens',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedeem = async () => {
    if (!wallet.connected || !amount) return
    setIsLoading(true)
    try {
      await redeemStableCoin(wallet, params.address.toString(), parseFloat(amount))
      toast({
        title: 'Successfully redeemed tokens',
        description: `${amount} ${stablecoin?.symbol} redeemed`
      })
      setAmount('')
    } catch (error: any) {
      toast({
        title: 'Error redeeming tokens',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!stablecoin) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image
              src={stablecoin.icon}
              alt={stablecoin.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <CardTitle className="text-2xl">{stablecoin.name}</CardTitle>
              <p className="text-muted-foreground">{stablecoin.symbol}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Target Currency</Label>
                <p>{stablecoin.targetCurrency}</p>
              </div>
              <div className="space-y-2">
                <Label>Total Supply</Label>
                <p>{stablecoin.totalSupply.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label>Exchange Rate</Label>
                <p>1 {stablecoin.symbol} = 1 {stablecoin.targetCurrency}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleMint}
                  disabled={isLoading || !wallet.connected || !amount}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Mint'}
                </Button>
                <Button
                  onClick={handleRedeem}
                  disabled={isLoading || !wallet.connected || !amount}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Redeem'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}