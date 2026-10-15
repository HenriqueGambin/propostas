// Conexão com o banco de dados (Supabase) — projeto "dello-eventos" (organização Dello).
// As propostas usam tabelas próprias (propostas, propostas_clientes, propostas_config) e só os
// e-mails da tabela propostas_acesso enxergam os dados (ver supabase/schema.sql).
// Chave "publishable": pode ficar no site; a segurança é feita pelas regras do banco (RLS).
// NUNCA coloque aqui a chave "secret" / "service_role".
// Para usar o MODO DEMONSTRAÇÃO, abra o site com ?demo no endereço.
window.DP_CONFIG = {
  supabaseUrl: 'https://ejnipomchwpqgajfrlql.supabase.co',
  supabaseAnonKey: 'sb_publishable_tJNfaTW6fxShYhtFnj4dGA_0eLVK8wb',
  permitirCadastro: false,
};
