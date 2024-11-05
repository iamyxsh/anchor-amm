use crate::{
    constants,
    error::AMMErrors,
    state::{amm::Amm, pool::Pool},
    MINIMUM_LIQUIDITY,
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount, Transfer},
};
use fixed::types::I64F64;

#[derive(Accounts)]
#[instruction(amm_id: Pubkey, mint_a: Pubkey,mint_b: Pubkey)]
pub struct DepositLiquidity<'info> {
    pub pool: Box<Account<'info, Pool>>,

    // /// CHECK:
    // #[account(
    //     seeds = [
    //         constants::AUTHORITY_SEED.as_bytes().as_ref(),
    //         amm_id.as_ref(),
    //         mint_a.key().as_ref(),
    //         mint_b.key().as_ref(),
    //     ],
    //     bump,
    // )]
    // pub pool_authority: AccountInfo<'info>,

    // #[account(
    //     mut,
    //     seeds = [
    //         constants::LIQUIDITY_MINT_SEED.as_bytes().as_ref(),
    //         amm_id.as_ref(),
    //         mint_a.key().as_ref(),
    //         mint_b.key().as_ref(),
    //     ],
    //     bump,
    // )]
    // pub mint_liquidity: Box<Account<'info, Mint>>,

    // pub mint_a: Box<Account<'info, Mint>>,

    // pub mint_b: Box<Account<'info, Mint>>,

    // #[account(
    //     init_if_needed,
    //     payer = payer,
    //     associated_token::mint = mint_a,
    //     associated_token::authority = pool_authority,
    // )]
    // pub pool_account_a: Box<Account<'info, TokenAccount>>,

    // #[account(
    //     init_if_needed,
    //     payer = payer,
    //     associated_token::mint = mint_b,
    //     associated_token::authority = pool_authority,
    // )]
    // pub pool_account_b: Box<Account<'info, TokenAccount>>,

    // #[account(
    //     init_if_needed,
    //     payer = payer,
    //     associated_token::mint = mint_liquidity,
    //     associated_token::authority = depositor,
    // )]
    // pub depositor_account_liquidity: Box<Account<'info, TokenAccount>>,

    // #[account(
    //     init_if_needed,
    //     payer = payer,
    //     associated_token::mint = mint_a,
    //     associated_token::authority = depositor,
    // )]
    // pub depositor_account_a: Box<Account<'info, TokenAccount>>,

    // #[account(
    //     init_if_needed,
    //     payer = payer,
    //     associated_token::mint = mint_b,
    //     associated_token::authority = depositor,
    // )]
    // pub depositor_account_b: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<DepositLiquidity>,
    amount_a: u64,
    amount_b: u64,
    _amm_id: Pubkey,
    _mint_a: Pubkey,
    _mint_b: Pubkey,
) -> Result<()> {
    // let mut amount_a = if amount_a > ctx.accounts.depositor_account_a.amount {
    //     ctx.accounts.depositor_account_a.amount
    // } else {
    //     amount_a
    // };
    // let mut amount_b = if amount_b > ctx.accounts.depositor_account_b.amount {
    //     ctx.accounts.depositor_account_b.amount
    // } else {
    //     amount_b
    // };

    // let pool_a = &ctx.accounts.pool_account_a;
    // let pool_b = &ctx.accounts.pool_account_b;

    // let pool_creation = pool_a.amount == 0 && pool_b.amount == 0;

    // (amount_a, amount_b) = if pool_creation {
    //     (amount_a, amount_b)
    // } else {
    //     let ratio = I64F64::from_num(pool_a.amount)
    //         .checked_mul(I64F64::from_num(pool_b.amount))
    //         .unwrap();

    //     if pool_a.amount > pool_b.amount {
    //         (
    //             I64F64::from_num(amount_b)
    //                 .checked_mul(ratio)
    //                 .unwrap()
    //                 .to_num::<u64>(),
    //             amount_b,
    //         )
    //     } else {
    //         (
    //             amount_a,
    //             I64F64::from_num(amount_a)
    //                 .checked_div(ratio)
    //                 .unwrap()
    //                 .to_num::<u64>(),
    //         )
    //     }
    // };

    // let mut liquidity = I64F64::from_num(amount_a)
    //     .checked_mul(I64F64::from_num(amount_b))
    //     .unwrap()
    //     .sqrt()
    //     .to_num::<u64>();

    // if pool_creation {
    //     if liquidity < MINIMUM_LIQUIDITY {
    //         return err!(AMMErrors::InvalidDepositAmount);
    //     }

    //     liquidity -= MINIMUM_LIQUIDITY;
    // }

    // token::transfer(
    //     CpiContext::new(
    //         ctx.accounts.token_program.to_account_info(),
    //         Transfer {
    //             from: ctx.accounts.depositor_account_a.to_account_info(),
    //             to: ctx.accounts.pool_account_a.to_account_info(),
    //             authority: ctx.accounts.payer.to_account_info(),
    //         },
    //     ),
    //     amount_a,
    // )?;
    // token::transfer(
    //     CpiContext::new(
    //         ctx.accounts.token_program.to_account_info(),
    //         Transfer {
    //             from: ctx.accounts.depositor_account_b.to_account_info(),
    //             to: ctx.accounts.pool_account_b.to_account_info(),
    //             authority: ctx.accounts.payer.to_account_info(),
    //         },
    //     ),
    //     amount_b,
    // )?;

    // let authority_bump = ctx.bumps.pool_authority;
    // let authority_seeds = &[
    //     constants::AUTHORITY_SEED.as_bytes(),
    //     &ctx.accounts.pool.amm_id.to_bytes(),
    //     &ctx.accounts.mint_a.key().to_bytes(),
    //     &ctx.accounts.mint_b.key().to_bytes(),
    //     &[authority_bump],
    // ];
    // let signer_seeds = &[&authority_seeds[..]];

    // token::mint_to(
    //     CpiContext::new_with_signer(
    //         ctx.accounts.token_program.to_account_info(),
    //         MintTo {
    //             mint: ctx.accounts.mint_liquidity.to_account_info(),
    //             to: ctx.accounts.depositor_account_liquidity.to_account_info(),
    //             authority: ctx.accounts.pool_authority.to_account_info(),
    //         },
    //         signer_seeds,
    //     ),
    //     liquidity,
    // )?;

    Ok(())
}
