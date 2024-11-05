import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { CpAmm } from '../target/types/cp_amm'
import { Keypair, PublicKey } from '@solana/web3.js'
import {
  createAssociatedTokenAccount,
  createMint,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token'

export const provider = anchor.AnchorProvider.env()
export const connection = provider.connection

export const program = anchor.workspace.CpAmm as Program<CpAmm>
export const decimals = 6
export const mintAmount = 100 * 10 ** decimals

export const ammSeed = program.rawIdl.constants
  .find((val) => val.name === 'CREATE_AMM_SEED')
  ['value'].replace('"', '')
  .replace('"', '')
export const poolSeed = program.rawIdl.constants
  .find((val) => val.name === 'CREATE_POOL_SEED')
  ['value'].replace('"', '')
  .replace('"', '')
export const liquidityMintSeed = program.rawIdl.constants
  .find((val) => val.name === 'LIQUIDITY_MINT_SEED')
  ['value'].replace('"', '')
  .replace('"', '')
export const authoritySeed = program.rawIdl.constants
  .find((val) => val.name === 'AUTHORITY_SEED')
  ['value'].replace('"', '')
  .replace('"', '')

export const fee = 300 // 3%
export const admin: Keypair = Keypair.generate()
export const user1: Keypair = Keypair.generate()
export const user2: Keypair = Keypair.generate()
export const mintAKeypair: Keypair = Keypair.generate()
export const mintBKeypair: Keypair = Keypair.generate()

export const amm_id: PublicKey = Keypair.generate().publicKey

export const ammKey: PublicKey = PublicKey.findProgramAddressSync(
  [Buffer.from(ammSeed), amm_id.toBuffer()],
  anchor.workspace.CpAmm.programId
)[0]

export const poolKey: PublicKey = PublicKey.findProgramAddressSync(
  [
    Buffer.from(poolSeed),
    ammKey.toBuffer(),
    mintAKeypair.publicKey.toBuffer(),
    mintBKeypair.publicKey.toBuffer(),
  ],
  anchor.workspace.CpAmm.programId
)[0]

const mintLiquidity = PublicKey.findProgramAddressSync(
  [
    Buffer.from(liquidityMintSeed),
    ammKey.toBuffer(),
    mintAKeypair.publicKey.toBuffer(),
    mintBKeypair.publicKey.toBuffer(),
  ],
  anchor.workspace.CpAmm.programId
)[0]

export const liquidityAccount = getAssociatedTokenAddressSync(
  mintLiquidity,
  user1.publicKey,
  true
)

export const user1AccA = getAssociatedTokenAddressSync(
  mintAKeypair.publicKey,
  user1.publicKey,
  true
)

export const user1AccB = getAssociatedTokenAddressSync(
  mintBKeypair.publicKey,
  user1.publicKey,
  true
)

export const createMintUtil = async () => {
  await createMint(
    connection,
    admin,
    admin.publicKey,
    admin.publicKey,
    6,
    mintAKeypair
  )

  await createMint(
    connection,
    admin,
    admin.publicKey,
    admin.publicKey,
    6,
    mintBKeypair
  )

  await getOrCreateAssociatedTokenAccount(
    connection,
    user1,
    mintAKeypair.publicKey,
    user1.publicKey,
    true
  )
  await getOrCreateAssociatedTokenAccount(
    connection,
    user1,
    mintBKeypair.publicKey,
    user1.publicKey,
    true
  )

  await mintTo(
    connection,
    admin,
    mintAKeypair.publicKey,
    getAssociatedTokenAddressSync(
      mintAKeypair.publicKey,
      user1.publicKey,
      true
    ),
    admin.publicKey,
    mintAmount
  )
  await mintTo(
    connection,
    admin,
    mintBKeypair.publicKey,
    getAssociatedTokenAddressSync(
      mintBKeypair.publicKey,
      user1.publicKey,
      true
    ),
    admin.publicKey,
    mintAmount
  )
}
