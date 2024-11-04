use crate::{constants, error::AMMErrors, state::amm::Amm, ANCHOR_DISCRIMINATOR};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: Pubkey, fee: u16)]
pub struct CreateAmm<'info> {
    #[account(
        init,
        payer = payer,
        space = ANCHOR_DISCRIMINATOR + Amm::INIT_SPACE,
        seeds = [
            constants::CREATE_AMM_SEED.as_bytes(),
            id.as_ref()
        ],
        bump,
        constraint = fee < 10000 @ AMMErrors::InvalidFee,
    )]
    pub amm: Account<'info, Amm>,

    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK:
    pub admin: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateAmm>, id: Pubkey, fee: u16) -> Result<()> {
    let amm = &mut ctx.accounts.amm;
    amm.id = id;
    amm.admin = ctx.accounts.admin.key();
    amm.fee = fee;
    Ok(())
}
