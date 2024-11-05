use crate::{
    constants,
    state::{amm::Amm, pool::Pool},
    ANCHOR_DISCRIMINATOR,
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token},
};

#[derive(Accounts)]
#[instruction(amm_id: Pubkey)]
pub struct CreatePool<'info> {
    #[account(
        seeds = [
          constants::CREATE_AMM_SEED.as_bytes().as_ref(),
          amm_id.as_ref()
        ],
        bump,
    )]
    pub amm: Box<Account<'info, Amm>>,

    #[account(
        init,
        payer = payer,
        space = ANCHOR_DISCRIMINATOR + Pool::INIT_SPACE,
        seeds = [
            constants::CREATE_POOL_SEED.as_bytes().as_ref(),
            amm.key().as_ref(),
            mint_a.key().as_ref(),
            mint_b.key().as_ref(),
        ],
        bump,
    )]
    pub pool: Account<'info, Pool>,

    pub mint_a: Box<Account<'info, Mint>>,

    pub mint_b: Box<Account<'info, Mint>>,

    /// CHECK:
    #[account(
        seeds = [
            constants::AUTHORITY_SEED.as_bytes().as_ref(),
            amm.key().as_ref(),
            mint_a.key().as_ref(),
            mint_b.key().as_ref(),
        ],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    #[account(
        init,
        payer = payer,
        seeds = [
            constants::LIQUIDITY_MINT_SEED.as_bytes().as_ref(),
            amm.key().as_ref(),
            mint_a.key().as_ref(),
            mint_b.key().as_ref(),
        ],
        bump,
        mint::decimals = 6,
        mint::authority = pool_authority,
    )]
    pub mint_liquidity: Box<Account<'info, Mint>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreatePool>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    pool.amm_id = ctx.accounts.amm.key();
    pool.mint_a = ctx.accounts.mint_a.key();
    pool.mint_b = ctx.accounts.mint_b.key();

    Ok(())
}
