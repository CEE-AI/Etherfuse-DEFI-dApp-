'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createStableCoin } from '@/utils/solana'
import { useToast } from '@/hooks/use-toast'

const FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD']

export function CreateStablecoinForm() {
  const wallet = useWallet()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    icon: '',
    targetCurrency: 'USD'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet.connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to create a stablecoin',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    try {
      const address = await createStableCoin(wallet, formData)
      toast({
        title: 'Stablecoin created!',
        description: `Address: ${address}`
      })
      setFormData({
        name: '',
        symbol: '',
        icon: '',
        targetCurrency: 'USD'
      })
    } catch (error: any) {
      toast({
        title: 'Error creating stablecoin',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol</Label>
        <Input
          id="symbol"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="icon">Icon URL</Label>
        <Input
          id="icon"
          type="url"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetCurrency">Target Currency</Label>
        <Select
          value={formData.targetCurrency}
          onValueChange={(value) => setFormData({ ...formData, targetCurrency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {FIAT_CURRENCIES.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading || !wallet.connected}>
        {isLoading ? 'Creating...' : 'Create Stablecoin'}
      </Button>
    </form>
  )
}