# LabTox — atualização do site público (v0.2)

Atualização do site `Barboss4/labtox-site`, não do `labtox-adm`.

## O que mudou

- Home: notícias acima de Sobre o laboratório; carrossel horizontal com no máximo cinco notícias mais recentes, com botões e navegação por toque/teclado.
- Ilustração de gráficos genéricos removida do topo. A área principal agora é tipográfica.
- Publicações: agrupamento por ano (decrescente), inclusive com busca e filtro de ano.
- Contato: endereço `labtox@unb.br`, formulário com assuntos Serviços, Parcerias, Projetos de pesquisa, Orientação, Eventos e visitas, Informações gerais e Outros.
- Obrigado: nova página de retorno `obrigado.html`.

## Instalação, sem perder os dados publicados

1. Extraia o arquivo `labtox-site-v02-atualizacao.zip`.
2. No repositório **Barboss4/labtox-site**, branch **main**, envie exatamente os arquivos fornecidos, mantendo as pastas.
3. Substitua `index.html`, `publicacoes.html`, `contato.html`, `js/config.js`, `js/site.js`, `css/style.css` e acrescente `obrigado.html`.
4. Aguarde **Actions → pages build and deployment → Success** e atualize a página com **Ctrl+F5**.
5. **Não altere** `data/labtox-conteudos.json` nem `assets/media`: esses arquivos são gerados/sincronizados pelo ADM. O ZIP de atualização **não os contém**.

## Ativação do formulário de contato

O GitHub Pages não envia mensagens diretamente. O formulário usa `formsubmit.co`, um serviço externo:

1. Depois do deploy, abra `https://barboss4.github.io/labtox-site/contato.html`.
2. Envie uma mensagem de teste com seu nome e endereço de e-mail.
3. Verifique a caixa **labtox@unb.br**. O FormSubmit enviará um e-mail de **ativação** para confirmar o destinatário. Clique no link de confirmação.
4. Envie outro teste com o assunto **Serviços** e confirme que a mensagem chegou a `labtox@unb.br`, com o assunto `[LabTox] Serviços`.
5. Faça um teste com **Parcerias** e confira se o título é alterado.
6. Verifique também a pasta de spam. Não é possível confirmar a entrega por testes locais: depende da ativação, rede, provedor e da caixa postal.

**Privacidade:** as mensagens passam por um terceiro (FormSubmit); leia as condições do serviço antes de usar em produção institucional. O formulário pede que não sejam inseridos dados sensíveis. Caso a UnB exija somente serviços institucionais, substitua por um backend aprovado pela TI.

**O que editar depois:** o e-mail público está em `js/config.js`. Se mudar o destinatário, atualize também `action`, `_next` e `_url` em `contato.html` (além de `obrigado.html`) e faça uma nova ativação para o novo e-mail.

## Testes rápidos

- Teste o carrossel com 0, 1, 2 e 5 notícias aprovadas; em telas pequenas, deslize lateralmente.
- Na aba Publicações, filtre por ano e pesquise por autor ou título; os títulos devem permanecer em grupos por ano.
- Verifique que a sincronização do ADM continua a atualizar `data/labtox-conteudos.json`.

**Nota:** `data/site.js` não faz parte desta versão do LabTox; as configurações públicas existentes estão em `js/config.js`.
