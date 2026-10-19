# Propostas · DelloPlast

Sistema para o Gustavo montar as propostas comerciais (que antes eram feitas numa planilha do Excel) e gerar o PDF para mandar ao cliente.
Site estático (HTML + CSS + JavaScript puro) com banco **Supabase**, no mesmo estilo do Dello Eventos e da Nathany.

## Telas

| Menu | O que faz |
|---|---|
| Propostas | Lista com pesquisa (número, cliente, CNPJ, item), filtro por situação e resumo do mês; abre, gera PDF, cria nova versão, duplica ou exclui |
| Nova proposta / editor | 1) número, ano, versão, data e situação · 2) cliente (puxa do cadastro) · 3) itens em tabela igual à planilha · 4) condições gerais · 5) paletes e paletização · 6) orientação da chapa · 7) observações. Barra fixa embaixo com totais, Salvar e Gerar PDF |
| Clientes | Cadastro (criado sozinho ao salvar uma proposta); nova proposta direto do cliente |
| Padrões | Quem emite, número inicial, item novo (NCM, unidade, cor, R$/kg) e condições gerais padrão |

## Regras de cálculo

- **Peso da chapa (kg)** = largura (mm) × comprimento (mm) × gramatura (g/m²) ÷ 1.000.000.000
- **Preço unitário** = peso da chapa × R$/kg, arredondado em 2 casas (o mesmo valor que aparece no PDF). Se digitar um valor na coluna Preço, ele vira manual (fica amarelo); apagar volta ao automático.
- **Subtotal** = preço unitário × quantidade
- **ICMS** e **IPI** = soma de subtotal × alíquota de cada item. ICMS "Incluso" não soma no total; IPI "Adicional" soma.
- **Valor total** = produtos + IPI (se adicional) + ICMS ST + paletes não retornáveis
- Palete **retornável** não soma no total; no PDF aparece como cobrado apenas se não houver devolução.
- A coluna **R$/kg** é interna: não aparece no PDF.
- Combinação de gramatura × espessura fora da tabela fica com borda amarela na célula Gram.

Numeração: `NÚMERO_ANO_VVERSÃO` (ex.: `559_26_V0`). Proposta nova pega o maior número do ano + 1 (ou o "número inicial" dos Padrões). "Nova versão" mantém o número e soma 1 na versão.

## PDF

"Gerar PDF" salva, abre a pré-visualização em A4 e "Baixar PDF" abre a impressão do navegador: escolher **Salvar como PDF**. O nome do arquivo já vem como `Proposta 559_26_V0 - CLIENTE`.

## Rodar no computador

```bash
python -m http.server 5520
```

Abra `http://localhost:5520`. Enquanto `assets/config.js` estiver sem a URL e a chave do Supabase, o site abre no **modo demonstração** (dados salvos só no navegador). Com o Supabase configurado, `?demo` no endereço força a demonstração.

## Estrutura

```
index.html               página única (rotas com #/)
assets/app.js            todo o sistema (cálculos, telas, PDF)
assets/styles.css        visual (azul DelloPlast, tema claro/escuro, folha A4)
assets/config.js         URL e chave pública do Supabase
assets/img               logos, imagens das chapas, tabela de gramaturas
supabase/schema.sql      tabelas (propostas, clientes, config) e regras de acesso (RLS)
```

## Supabase

- Fica no projeto **dello-eventos** (organização Dello), junto com o app de eventos, mas com tabelas próprias: `propostas`, `propostas_clientes`, `propostas_config` e `propostas_acesso`.
- Só os e-mails da tabela `propostas_acesso` enxergam e gravam os dados (RLS). Outros usuários do app de eventos não veem nada; quem entra sem estar liberado vê o aviso "não tem acesso".
- Liberados hoje: `gustavo.dicelio@dello.com.br` e `henriquedicelio@gmail.com`. Para liberar outra pessoa: SQL Editor → `insert into public.propostas_acesso (email, nome) values ('fulano@dello.com.br', 'Fulano');`
- O login é o mesmo do Supabase do app de eventos (Authentication → Users). Quem não tem conta precisa ser criado lá.
- `supabase/schema.sql` pode ser rodado de novo sem apagar nada.

## Publicação

- Site: **https://henriquegambin.github.io/propostas/** (demonstração: `https://henriquegambin.github.io/propostas/?demo`).
- GitHub Pages da conta `HenriqueGambin`, repositório `propostas`, ramo `main` (remote `origin`). Basta dar `git push` que o site atualiza em cerca de 1 minuto.
- Instala como aplicativo (botão "Instalar aplicativo" no menu). Não pode ficar dentro de `dello-eventos.github.io`: o app de eventos instalado cobre o endereço inteiro e o Chrome não deixa instalar outro app ali. Pelo mesmo motivo, não criar um site com manifest na raiz `henriquegambin.github.io`.
- Endereço antigo `dello-eventos.github.io/propostas/` (repositório `dello-eventos/propostas`, remote `antigo`) só redireciona para o novo.
- Supabase → Authentication → URL Configuration: Redirect URL `https://henriquegambin.github.io/propostas/**` (para o link de "esqueci minha senha").

Ao mudar CSS/JS, troque o `?v=` em `index.html` para o navegador não usar a versão antiga.
