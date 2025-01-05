import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WalletConnect } from '@/components/wallet-connect'
import { CreateStablecoinForm } from '@/components/create-stablecoin-form'
import { StablecoinList } from '@/components/stablecoin-list'
import { ErrorBoundary } from '@/components/error-boundary'

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto py-6 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Stablecoin Creator</h1>
          <WalletConnect />
        </header>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">My Stablecoins</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <StablecoinList />
          </TabsContent>
          <TabsContent value="create" className="mt-6">
            <div className="max-w-md mx-auto">
              <CreateStablecoinForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}