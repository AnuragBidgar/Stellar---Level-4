#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, symbol_short, vec, IntoVal};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum JobStatus {
    Created,
    Locked,
    WorkSubmitted,
    Completed,
    Disputed,
    Resolved,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Job {
    pub client: Address,
    pub freelancer: Address,
    pub arbitrator: Address,
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

    pub fn create_job(env: Env, client: Address, freelancer: Address, arbitrator: Address, amount: i128) -> u32 {
        client.require_auth();
        
        let mut job_count: u32 = env.storage().instance().get(&DataKey::JobCount).unwrap_or(0);
        job_count += 1;
        
        let job = Job {
            client: client.clone(),
            freelancer: freelancer.clone(),
            arbitrator,
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
        let mut job: Job = env.storage().persistent().get(&DataKey::Job(job_id)).unwrap();
        job.freelancer.require_auth();
        
        if job.status != JobStatus::Locked {
            panic!("invalid job status");
        }

        job.status = JobStatus::WorkSubmitted;
        env.storage().persistent().set(&DataKey::Job(job_id), &job);
        
        env.events().publish((Symbol::new(&env, "WorkSubmitted"), job_id), job.freelancer);
    }

    pub fn dispute_job(env: Env, job_id: u32, caller: Address) {
        caller.require_auth();
        let mut job: Job = env.storage().persistent().get(&DataKey::Job(job_id)).unwrap();
        
        // Either client or freelancer can dispute if locked or submitted
        if job.status != JobStatus::Locked && job.status != JobStatus::WorkSubmitted {
            panic!("cannot dispute at this stage");
        }
        
        if caller != job.client && caller != job.freelancer {
            panic!("unauthorized to dispute");
        }

        job.status = JobStatus::Disputed;
        env.storage().persistent().set(&DataKey::Job(job_id), &job);
        
        env.events().publish((Symbol::new(&env, "JobDisputed"), job_id), caller);
    }


    pub fn resolve_dispute(env: Env, job_id: u32, to_freelancer: bool) {
        let mut job: Job = env.storage().persistent().get(&DataKey::Job(job_id)).unwrap();
        job.arbitrator.require_auth();
        
        if job.status != JobStatus::Disputed {
            panic!("job not in dispute");
        }
        
        let token: Address = env.storage().instance().get(&DataKey::TokenContract).unwrap();
        let escrow_addr = env.current_contract_address();
        
        let recipient = if to_freelancer { job.freelancer.clone() } else { job.client.clone() };
        
        env.invoke_contract::<()>(
            &token,
            &Symbol::new(&env, "transfer"),
            vec![&env, escrow_addr.into_val(&env), recipient.into_val(&env), job.amount.into_val(&env)],
        );
        
        job.status = JobStatus::Resolved;
        env.storage().persistent().set(&DataKey::Job(job_id), &job);
        
        env.events().publish((Symbol::new(&env, "DisputeResolved"), job_id), to_freelancer);
    }

    pub fn release_fund(env: Env, job_id: u32) {
        let mut job: Job = env.storage().persistent().get(&DataKey::Job(job_id)).unwrap();
        job.client.require_auth();
        
        if job.status != JobStatus::Locked && job.status != JobStatus::WorkSubmitted {
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
