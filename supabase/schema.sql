-- Propostas DelloPlast — tabelas e regras de acesso
-- Fica dentro do projeto Supabase "dello-eventos" (organização Dello), separado das tabelas dos eventos:
-- tudo aqui começa com "propostas" e só os e-mails da tabela propostas_acesso enxergam os dados.
-- Rode este arquivo inteiro no Supabase: SQL Editor → New query → colar → Run. Pode rodar de novo sem problema.

-- ---------------------------------------------------------------
-- quem pode usar o sistema de propostas
-- ---------------------------------------------------------------
create table if not exists public.propostas_acesso (
  email     text primary key check (email = lower(email)),
  nome      text,
  criado_em timestamptz not null default now()
);
insert into public.propostas_acesso (email, nome) values
  ('gustavo.dicelio@dello.com.br', 'Gustavo Gambin Dicelio'),
  ('henriquedicelio@gmail.com', 'Henrique Gambin Di Celio')
on conflict (email) do nothing;

-- true quando o usuário logado está na lista acima
create or replace function public.propostas_liberado()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.propostas_acesso where email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
revoke all on function public.propostas_liberado() from public, anon;
grant execute on function public.propostas_liberado() to authenticated;

-- atualizado_em automático
create or replace function public.propostas_tocar_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end $$;

-- ---------------------------------------------------------------
-- clientes (cadastro para puxar nas próximas propostas)
-- ---------------------------------------------------------------
create table if not exists public.propostas_clientes (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  cnpj          text default '',
  ie            text default '',
  contato       text default '',
  telefone      text default '',
  email         text default '',
  endereco      text default '',
  cep           text default '',
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
drop trigger if exists propostas_clientes_atualizado on public.propostas_clientes;
create trigger propostas_clientes_atualizado before update on public.propostas_clientes
  for each row execute function public.propostas_tocar_atualizado_em();

-- ---------------------------------------------------------------
-- propostas (cada versão é uma linha: 559_26_V0, 559_26_V1…)
-- "dados" guarda o formulário inteiro: cliente, itens, condições,
-- paletes, paletização, orientação da chapa, observação e emissor.
-- ---------------------------------------------------------------
create table if not exists public.propostas (
  id            uuid primary key default gen_random_uuid(),
  numero        integer not null check (numero > 0),
  ano           integer not null check (ano between 2000 and 2100),
  versao        integer not null default 0 check (versao >= 0),
  status        text not null default 'rascunho' check (status in ('rascunho', 'enviada', 'aprovada', 'perdida')),
  cliente_nome  text,
  total         numeric(14, 2) not null default 0,
  dados         jsonb not null default '{}'::jsonb,
  criado_por    uuid default auth.uid() references auth.users (id) on delete set null,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (ano, numero, versao)
);
create index if not exists propostas_num_idx on public.propostas (ano desc, numero desc, versao desc);
drop trigger if exists propostas_atualizado on public.propostas;
create trigger propostas_atualizado before update on public.propostas
  for each row execute function public.propostas_tocar_atualizado_em();

-- ---------------------------------------------------------------
-- padrões (emissor, numeração, condições, item novo)
-- ---------------------------------------------------------------
create table if not exists public.propostas_config (
  id            text primary key,
  valor         jsonb not null default '{}'::jsonb,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
drop trigger if exists propostas_config_atualizado on public.propostas_config;
create trigger propostas_config_atualizado before update on public.propostas_config
  for each row execute function public.propostas_tocar_atualizado_em();

-- ---------------------------------------------------------------
-- Segurança (RLS): só os e-mails liberados leem e gravam.
-- Outros usuários do app de eventos não enxergam nada daqui.
-- ---------------------------------------------------------------
alter table public.propostas_acesso   enable row level security;
alter table public.propostas_clientes enable row level security;
alter table public.propostas          enable row level security;
alter table public.propostas_config   enable row level security;

revoke all on public.propostas_acesso, public.propostas_clientes, public.propostas, public.propostas_config from anon;
revoke all on public.propostas_acesso from authenticated;   -- a lista só muda pelo painel do Supabase
grant select, insert, update, delete on public.propostas_clientes, public.propostas, public.propostas_config to authenticated;

drop policy if exists "liberados gerenciam clientes" on public.propostas_clientes;
create policy "liberados gerenciam clientes" on public.propostas_clientes
  for all to authenticated using (public.propostas_liberado()) with check (public.propostas_liberado());

drop policy if exists "liberados gerenciam propostas" on public.propostas;
create policy "liberados gerenciam propostas" on public.propostas
  for all to authenticated using (public.propostas_liberado()) with check (public.propostas_liberado());

drop policy if exists "liberados gerenciam config" on public.propostas_config;
create policy "liberados gerenciam config" on public.propostas_config
  for all to authenticated using (public.propostas_liberado()) with check (public.propostas_liberado());

-- Para liberar outra pessoa depois:
--   insert into public.propostas_acesso (email, nome) values ('fulano@dello.com.br', 'Fulano');
