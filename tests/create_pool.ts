import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import {
  createMint,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'
import { CpAmm } from '../target/types/cp_amm'
import { assert, expect } from 'chai'

describe('Create Pool', () => {
  anchor.setProvider(anchor.AnchorProvider.env())

  const provider = anchor.AnchorProvider.env()
  const connection = provider.connection

  const program = anchor.workspace.CpAmm as Program<CpAmm>

  const ammSeed = program.rawIdl.constants
    .find((val) => val.name === 'CREATE_AMM_SEED')
    ['value'].replace('"', '')
    .replace('"', '')
  const poolSeed = program.rawIdl.constants
    .find((val) => val.name === 'CREATE_POOL_SEED')
    ['value'].replace('"', '')
    .replace('"', '')
  const liquidityMintSeed = program.rawIdl.constants
    .find((val) => val.name === 'LIQUIDITY_MINT_SEED')
    ['value'].replace('"', '')
    .replace('"', '')
  const authoritySeed = program.rawIdl.constants
    .find((val) => val.name === 'AUTHORITY_SEED')
    ['value'].replace('"', '')
    .replace('"', '')

  let fee = 300 // 3%
  let admin: Keypair = Keypair.generate()

  let amm_id: PublicKey
  let ammKey: PublicKey

  const mintAKeypair = Keypair.generate()
  const mintBKeypair = Keypair.generate()

  let poolKey: PublicKey

  beforeEach(async () => {
    await connection.confirmTransaction(
      await connection.requestAirdrop(admin.publicKey, 10 ** 10)
    )
  })

  it('it can create pool', async () => {
    amm_id = Keypair.generate().publicKey
    ammKey = PublicKey.findProgramAddressSync(
      [Buffer.from(ammSeed), amm_id.toBuffer()],
      anchor.workspace.CpAmm.programId
    )[0]

    poolKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(poolSeed),
        ammKey.toBuffer(),
        mintAKeypair.publicKey.toBuffer(),
        mintBKeypair.publicKey.toBuffer(),
      ],
      anchor.workspace.CpAmm.programId
    )[0]

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

    await program.methods
      .createAmm(amm_id, fee)
      .accounts({
        admin: admin.publicKey,
      })
      .rpc()
    await program.methods
      .createPool(amm_id)
      .accounts({
        mintA: mintAKeypair.publicKey,
        mintB: mintBKeypair.publicKey,
      })
      .rpc()

    const poolAccount = await program.account.pool.fetch(poolKey)
    expect(poolAccount.mintA.toString()).to.be.eq(
      mintAKeypair.publicKey.toString()
    )
    expect(poolAccount.mintA.toString()).to.be.eq(
      mintAKeypair.publicKey.toString()
    )
  })
})
