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
import {
  admin,
  amm_id,
  connection,
  createMintUtil,
  fee,
  mintAKeypair,
  mintBKeypair,
  poolKey,
  program,
  user1,
} from './utils'

describe.skip('Create Pool', () => {
  anchor.setProvider(anchor.AnchorProvider.env())

  beforeEach(async () => {
    await connection.confirmTransaction(
      await connection.requestAirdrop(admin.publicKey, 10 ** 10)
    )
    await connection.confirmTransaction(
      await connection.requestAirdrop(user1.publicKey, 10 ** 10)
    )
  })

  it('it can create pool', async () => {
    await createMintUtil()

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
    expect(poolAccount.mintB.toString()).to.be.eq(
      mintBKeypair.publicKey.toString()
    )
  })
})
