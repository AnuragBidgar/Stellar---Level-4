#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, symbol_short, vec, IntoVal};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum JobStatus {
    Created,
    Locked,
    Completed,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Job {
    pub client: Address,
    pub freelancer: Address,
    pub amount: i128,
    pub status: JobStatus,
}

#[contracttype]
pub enum DataKey {
    Job(u32),
    JobCount,
    TokenContract,
    ReputationContract,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn initialize(env: Env, token: Address, reputation: Address) {
        if env.storage().instance().has(&DataKey::TokenContract) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::TokenContract, &token);
        env.storage().instance().set(&DataKey::ReputationContract, &reputation);
        env.storage().instance().set(&DataKey::JobCount, &0u32);
    }

    pub fn create_job(env: Env, client: Address, freelancer: Address, amount: i128) -> u32 {
        client.require_auth();
        
        let mut job_count: u32 = env.storage().instance().get(&DataKey::JobCount).unwrap_or(0);
        job_count += 1;
        
        let job = Job {
            client: client.clone(),
            freelancer: freelancer.clone(),
            amount,
            status: JobStatus::Created,
        };
        
        env.storage().persistent().set(&DataKey::Job(job_count), &job);
        env.storage().instance().set(&DataKey::JobCount, &job_count);
        
        env.events().publish((Symbol::new(&env, "JobCreated"), job_count), (client, freelancer, amount));
        
        job_count
    }

    pub fn lock_payment(env: Env, job_id: u32) {
        let mut job: Job = env.storage().persistent().get(&DataKey::Job(job_id)).unwrap();
        job.client.require_auth();
        
        if job.status != JobStatus::Created {
            panic!("invalid job status");
        }
        
        let token: Address = env.storage().instance().get(&DataKey::TokenContract).unwrap();
        let escrow_addr = env.current_contract_address();
        
        env.invoke_contract::<()>(
            &token,
            &Symbol::new(&env, "transfer"),
            vec![&env, job.client.into_val(&env), escrow_addr.into_val(&env), job.amount.into_val(&env)],
        );
        
        job.status = JobStatus::Locked;
        env.storage().persistent().set(&DataKey::Job(job_id), &job);
        
        env.events().publish((Symbol::new(&env, "PaymentLocked"), job_id), job.amount);
    }

    pub fn submit_work(env: Env, job_id: u32) {
        let job: Job = env.storage().persistent().get(&DataKey::Job(job_id)).unwrap();
        job.freelancer.require_auth();
        
        if job.status != JobStatus::Locked {
            panic!("invalid job status");
        }
        
        env.events().publish((Symbol::new(&env, "WorkSubmitted"), job_id), job.freelancer);
    }

    pub fn release_fund(env: Env, job_id: u32) {
        let mut job: Job = env.storage().persistent().get(&DataKey::Job(job_id)).unwrap();
        job.client.require_auth();
        
        if job.status != JobStatus::Locked {
            panic!("invalid job status");
        }
        
        let token: Address = env.storage().instance().get(&DataKey::TokenContract).unwrap();
        let reputation: Address = env.storage().instance().get(&DataKey::ReputationContract).unwrap();
        let escrow_addr = env.current_contract_address();
        
        // Transfer to freelancer
        env.invoke_contract::<()>(
            &token,
            &Symbol::new(&env, "transfer"),
            vec![&env, escrow_addr.into_val(&env), job.freelancer.clone().into_val(&env), job.amount.into_val(&env)],
        );
        
        // Update reputation
        let points: i32 = 10;
        env.invoke_contract::<()>(
            &reputation,
            &Symbol::new(&env, "update_score"),
            vec![&env, job.freelancer.clone().into_val(&env), points.into_val(&env)],
        );
        
        job.status = JobStatus::Completed;
        env.storage().persistent().set(&DataKey::Job(job_id), &job);
        
        env.events().publish((Symbol::new(&env, "PaymentReleased"), job_id), job.amount);
        env.events().publish((Symbol::new(&env, "ReputationUpdated"), job.freelancer), points);
    }
}
