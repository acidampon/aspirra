-- Aspirra production persistence contract (PostgreSQL-compatible)
create table if not exists aspirra_accounts (
  id text primary key,
  email text not null default '',
  mode text not null check (mode in ('local','cloud')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aspirra_sync_snapshots (
  account_id text primary key references aspirra_accounts(id) on delete cascade,
  format_version integer not null,
  schema_version integer not null,
  revision bigint not null check (revision >= 0),
  device_id text not null,
  updated_at timestamptz not null,
  envelope jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists aspirra_devices (
  id text primary key,
  account_id text not null references aspirra_accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists aspirra_devices_account_idx on aspirra_devices(account_id);
