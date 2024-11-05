use anchor_lang::prelude::*;

pub const ANCHOR_DISCRIMINATOR: usize = 8;

#[constant]
pub const CREATE_AMM_SEED: &str = "amm";

#[constant]
pub const CREATE_POOL_SEED: &str = "pool";

#[constant]
pub const LIQUIDITY_MINT_SEED: &str = "liquidity_mint";

#[constant]
pub const AUTHORITY_SEED: &str = "authority";

#[constant]
pub const MINIMUM_LIQUIDITY: u64 = 100;
