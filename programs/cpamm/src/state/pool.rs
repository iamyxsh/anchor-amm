use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Pool {
    pub amm_id: Pubkey,

    pub mint_a: Pubkey,

    pub mint_b: Pubkey,
}
