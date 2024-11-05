pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;

declare_id!("6YeQp4m2Ka2bVn6qxbyFVTRKp2maLWYuuNuposZrqbc2");

#[program]
pub mod cp_amm {
    use super::*;

    pub fn create_amm(ctx: Context<CreateAmm>, id: Pubkey, fee: u16) -> Result<()> {
        create_amm::handler(ctx, id, fee)
    }

    pub fn create_pool(ctx: Context<CreatePool>, _amm_id: Pubkey) -> Result<()> {
        create_pool::handler(ctx)
    }
}
