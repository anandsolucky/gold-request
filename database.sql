
-- ========================
-- bucket
-- ========================

-- create table
create table bucket (
    bucketNumber Integer PRIMARY KEY,
    coins Integer
);

-- insert values
insert into bucket values(1,1000);

-- display data
select * from bucket;



-- =====================
-- Transactions
-- =====================

create table transactions (
    tid SERIAL PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now(),
    requested_user varchar(30),
    requested_coins varchar(30),
    balance_before_request Integer,
    balance_after_request Integer
);