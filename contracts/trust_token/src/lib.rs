#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, symbol_short};

#[contracttype]
pub enum DataKey {
    Balance(Address),
    Admin,
}

#[contract]
pub struct TrustToken;

#[contractimpl]
impl TrustToken {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        
        let mut balance: i128 = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &balance);
        
        env.events().publish((symbol_short!("mint"), to), amount);
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        
        let mut from_balance: i128 = env.storage().persistent().get(&DataKey::Balance(from.clone())).unwrap_or(0);
        if from_balance < amount {
            panic!("insufficient balance");
        }
        from_balance -= amount;
        env.storage().persistent().set(&DataKey::Balance(from.clone()), &from_balance);
        
        let mut to_balance: i128 = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or(0);
        to_balance += amount;
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &to_balance);
        
        env.events().publish((symbol_short!("transfer"), from, to), amount);
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(id)).unwrap_or(0)
    }
}
