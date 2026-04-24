#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, symbol_short};

#[contracttype]
pub enum DataKey {
    Score(Address),
    EscrowContract,
}

#[contract]
pub struct ReputationContract;

#[contractimpl]
impl ReputationContract {
    pub fn initialize(env: Env, escrow: Address) {
        if env.storage().instance().has(&DataKey::EscrowContract) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::EscrowContract, &escrow);
    }

    pub fn update_score(env: Env, user: Address, points: i32) {
        let escrow: Address = env.storage().instance().get(&DataKey::EscrowContract).unwrap();
        escrow.require_auth(); // Only escrow contract can update reputation
        
        let mut score: i32 = env.storage().persistent().get(&DataKey::Score(user.clone())).unwrap_or(0);
        score += points;
        env.storage().persistent().set(&DataKey::Score(user.clone()), &score);
        
        env.events().publish((symbol_short!("RepUpd"), user), score);
    }

    pub fn get_score(env: Env, user: Address) -> i32 {
        env.storage().persistent().get(&DataKey::Score(user)).unwrap_or(0)
    }
}
