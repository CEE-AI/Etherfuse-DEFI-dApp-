import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js'
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor'
import { CreateStableCoinParams } from '@/types/stablecoin'

export const PROGRAM_ID = new PublicKey('8fcF8kqLTmczkMuoYUDDvmbYjfcS7BpbxuqhEco7nv1j')

// Create a connection to the devnet cluster
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

export class SolanaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SolanaError'
  }
}

export async function createStableCoin(
  wallet: any,
  params: CreateStableCoinParams
): Promise<string> {
  try {
    if (!wallet.publicKey) {
      throw new SolanaError('Wallet not connected')
    }

    const provider = new AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    )

    const program = new Program(idl, PROGRAM_ID, provider)

    const [stablecoinPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(params.symbol)],
      program.programId
    )

    const tx = await program.methods
      .createStableCoin(params.name, params.symbol, params.icon, params.targetCurrency)
      .accounts({
        stablecoin: stablecoinPDA,
        authority: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    await connection.confirmTransaction(tx, 'confirmed')
    return stablecoinPDA.toString()
  } catch (error: any) {
    console.error('Error creating stablecoin:', error)
    throw new SolanaError(error.message)
  }
}

export async function mintStableCoin(
  wallet: any,
  stablecoinAddress: string,
  amount: number
): Promise<void> {
  try {
    if (!wallet.publicKey) {
      throw new SolanaError('Wallet not connected')
    }

    const provider = new AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    )

    const program = new Program(idl, PROGRAM_ID, provider)

    const tx = await program.methods
      .mint(new BN(amount))
      .accounts({
        stablecoin: new PublicKey(stablecoinAddress),
        authority: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    await connection.confirmTransaction(tx, 'confirmed')
  } catch (error: any) {
    console.error('Error minting stablecoin:', error)
    throw new SolanaError(error.message)
  }
}

export async function redeemStableCoin(
  wallet: any,
  stablecoinAddress: string,
  amount: number
): Promise<void> {
  try {
    if (!wallet.publicKey) {
      throw new SolanaError('Wallet not connected')
    }

    const provider = new AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    )

    const program = new Program(idl, PROGRAM_ID, provider)

    const tx = await program.methods
      .redeem(new BN(amount))
      .accounts({
        stablecoin: new PublicKey(stablecoinAddress),
        authority: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    await connection.confirmTransaction(tx, 'confirmed')
  } catch (error: any) {
    console.error('Error redeeming stablecoin:', error)
    throw new SolanaError(error.message)
  }
}