import * as anchor from '@coral-xyz/anchor'
import { expect } from 'chai'
import {
  admin,
  amm_id,
  connection,
  createMintUtil,
  fee,
  liquidityAccount,
  mintAKeypair,
  mintAmount,
  mintBKeypair,
  poolKey,
  program,
  user1,
  user1AccA,
  user1AccB,
} from './utils'

describe('Deposit Liquidity', () => {
  anchor.setProvider(anchor.AnchorProvider.env())

  beforeEach(async () => {
    await connection.confirmTransaction(
      await connection.requestAirdrop(admin.publicKey, 10 ** 10)
    )
    await connection.confirmTransaction(
      await connection.requestAirdrop(user1.publicKey, 10 ** 10)
    )
  })

  it('deposit', async () => {
    await createMintUtil()

    await program.methods
      .createAmm(amm_id, fee)
      .accounts({
        admin: admin.publicKey,
      })
      .rpc()
    const tx = await program.methods
      .createPool(amm_id)
      .accounts({
        mintA: mintAKeypair.publicKey,
        mintB: mintBKeypair.publicKey,
      })
      .rpc()


    await program.methods
      .depositLiquidity(
        new anchor.BN(mintAmount),
        new anchor.BN(mintAmount),
        amm_id,
        mintAKeypair.publicKey,
        mintBKeypair.publicKey
    ).accounts({
        pool: 
      })
      .rpc()

    const depositTokenAccountLiquditiy =
      await connection.getTokenAccountBalance(liquidityAccount)
    expect(depositTokenAccountLiquditiy.value.amount).to.equal(mintAmount)
    const depositTokenAccountA = await connection.getTokenAccountBalance(
      user1AccA
    )
    expect(depositTokenAccountA.value.amount).to.equal(0)
    const depositTokenAccountB = await connection.getTokenAccountBalance(
      user1AccB
    )
    expect(depositTokenAccountB.value.amount).to.equal(0)
  })
})
