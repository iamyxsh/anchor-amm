use anchor_lang::prelude::*;

#[error_code]
pub enum AMMErrors {
    #[msg("Fee should be in range 0 - 1000")]
    InvalidFee,
}
