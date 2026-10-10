# LabTox — site público v0.1

Site institucional estático do Laboratório de Toxicologia da Universidade de Brasília, pronto para o repositório `labtox-site` e GitHub Pages.

## Conteúdo

- `index.html`: apresentação, notícias, artigos e galeria em destaque
- `noticias.html` e `noticia.html?id=...`: listagem e leitura de notícias
- `publicacoes.html`: referências com filtros por ano e busca
- `servicos.html`: serviços ativos
- `equipe.html`: integrantes ativos, Lattes e ORCID
- `galeria.html` e `album.html?id=...`: álbuns e fotos ampliáveis
- `contato.html`: informações institucionais
- `css/style.css`: paleta azul `#173F70`, verde `#32835C`, azul-claro `#E6EFF5`
- `js/config.js`: identidade, links e contato (sem segredos)
- `js/site.js`: interface pública que lê o JSON estático
- `data/labtox-conteudos.json`: conteúdo aprovado, atualmente vazio
- `assets/favicon.svg`: ícone provisório LT, substituível pela logo final

## Como publicar no GitHub Pages

1. Baixe o ZIP, extraia e abra a pasta `labtox-site-v01`.
2. No GitHub, abra o repositório `labtox-site`.
3. Envie **o conteúdo de dentro da pasta**, sem criar uma pasta `labtox-site-v01` na raiz. O `index.html` deve ficar na raiz.
4. Em **Settings → Pages**, escolha **Deploy from a branch**, `main`, pasta `/(root)`, e **Save**.
5. Aguarde o deploy. O endereço padrão é `https://<nome-de-usuario>.github.io/labtox-site/` quando publicado como repositório de projeto.

> Este pacote não deve ser enviado para `labtox-adm`. O painel administrativo continua no Cloudflare Pages.

## Alterar logo, contato e textos institucionais

Edite `js/config.js`.

- Para usar a logo oficial: envie o arquivo para `assets/logo.png` e defina `logo: 'assets/logo.png'`.
- O símbolo provisório `LT` continuará aparecendo enquanto `logo` estiver vazio.
- Preencha `email` e, se desejado, `telefone` e `endereco` com as informações institucionais confirmadas.
- Altere textos fixos diretamente nas páginas `.html` conforme a necessidade.

## Como os dados do ADM chegarão ao site público

O ADM v0.8 já pode gerar o JSON no formato `labtox-conteudos-v1`. O site público foi construído para ler esse formato:

```
data/labtox-conteudos.json
```

O conteúdo do arquivo tem as chaves `noticias`, `publicacoes`, `galeria`, `equipe` e `servicos`.

**Enquanto não houver sincronização automática**, use o ADM → Backup JSON (conteúdos aprovados), renomeie o arquivo para `labtox-conteudos.json` e substitua `data/labtox-conteudos.json` no repositório público. Só faça isso com o arquivo exportado pela rota editorial, que omite rascunhos e pendências.

**IMPORTANTE SOBRE IMAGENS**: valores como `r2://uploads/1/UUID.png` não são URLs acessíveis na internet. O bucket do R2 é privado e deve continuar privado. Este site espera uma cópia das imagens **aprovadas** em:

```
assets/media/uploads/1/UUID.png
```

Se as imagens ainda não tiverem sido copiadas, o site mostrará um substituto gráfico (sem divulgar os arquivos privados). A futura integração automática deverá copiar as imagens autorizadas e o JSON ao repositório público, preservando esses caminhos. Não exponha o R2 inteiro por uma URL pública.

## O que ainda falta

- Criar a rotina segura de **sincronização automática** `labtox-adm → labtox-site` com autenticação de servidor (GitHub App ou token restrito guardado como Secret no Cloudflare). Ainda **não está implementada** neste pacote.
- Copiar os arquivos R2 aprovados para `assets/media` ao publicar, e remover cópias públicas quando um conteúdo for despublicado conforme a política editorial.
- Preencher logotipo definitivo e contatos oficiais.
- Opcional: domínio/subdomínio institucional e analytics respeitando privacidade.

O site **não consulta o banco D1, não exige Supabase e não tem credenciais administrativas**. A publicação estática continuará disponível mesmo que o ADM esteja em manutenção.

## Teste local

Abrir arquivos diretamente com `file://` pode impedir o JavaScript de ler o JSON por restrições do navegador. Se quiser testar localmente, abra um terminal na pasta do projeto e execute `python -m http.server 8000`; depois visite `http://localhost:8000`.

## Segurança e acessibilidade

- Conteúdo do JSON é escapado antes de aparecer no HTML; o editor interpreta apenas um subconjunto de Markdown, não executa HTML de usuários.
- Links externos têm `rel="noopener noreferrer"`.
- Botões e menus têm atributos de acessibilidade, navegação por teclado e modo responsivo.
- Nenhuma chave secreta do Cloudflare ou GitHub deve ser colocada nos arquivos públicos.

