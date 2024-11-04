import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { CpAmm } from '../target/types/cp_amm'
import { assert, expect } from 'chai'

describe('Create AMM', () => {
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.CpAmm as Program<CpAmm>

  const seed = program.rawIdl.constants[0]['value']
    .replace('"', '')
    .replace('"', '')

  let fee = 300 // 3%
  let admin: Keypair

  let id: PublicKey
  let ammKey: PublicKey

  beforeEach(() => {
    admin = Keypair.generate()
    id = Keypair.generate().publicKey
    ammKey = PublicKey.findProgramAddressSync(
      [Buffer.from(seed), id.toBuffer()],
      anchor.workspace.CpAmm.programId
    )[0]
  })

  it('it can create amm', async () => {
    await program.methods
      .createAmm(id, fee)
      .accounts({
        admin: admin.publicKey,
      })
      .rpc()

    const ammAccount = await program.account.amm.fetch(ammKey)
    expect(ammAccount.admin.toString()).to.be.eq(admin.publicKey.toString())
    expect(ammAccount.fee).to.be.eq(fee)
    expect(ammAccount.id.toString()).to.be.eq(id.toString())
  })

  it('it fails if given invalid fee', async () => {
    fee = 10000

    try {
      await program.methods
        .createAmm(id, fee)
        .accounts({
          admin: admin.publicKey,
        })
        .rpc()
      assert.fail('the fee is invalid, the call should fail')
    } catch (err) {
      const error = program.rawIdl.errors[0]['msg']
      assert.equal(err.error.errorMessage, error)
    }
  })
})
