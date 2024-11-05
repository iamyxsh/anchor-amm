use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Amm {
    pub id: Pubkey,

    pub admin: Pubkey,

    pub fee: u16,
}
