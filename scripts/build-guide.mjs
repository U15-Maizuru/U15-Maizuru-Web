// CHaser-Book の原稿(Markdown)を、サイトの guide/*.html ページへ変換するスクリプト。
// 原稿(CHaser-Book)が更新されたときに手動で実行する(npm run generate:guide)。
// 生成された guide/*.html と public/images/guide/* はリポジトリにコミットする。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const BOOK_ROOT = path.resolve(SITE_ROOT, '..', 'CHaser-Book');
const ASSETS_IMAGES_ROOT = path.join(BOOK_ROOT, 'assets', 'images');
const OUT_DIR = path.join(SITE_ROOT, 'guide');
const IMAGES_OUT_ROOT = path.join(SITE_ROOT, 'public', 'images', 'guide');

// 入門編(Blockly版)は、両版共通の章(manuscript_shared)と入門編だけの章(manuscript_blockly)からなる。
for (const dir of ['manuscript_shared', 'manuscript_blockly']) {
  if (!fs.existsSync(path.join(BOOK_ROOT, dir))) {
    console.error(`原稿ディレクトリが見つかりません: ${path.join(BOOK_ROOT, dir)}`);
    console.error('CHaser-Book リポジトリが、このリポジトリと同じ階層 (../CHaser-Book) に存在することを確認してください。');
    process.exit(1);
  }
}

const md = new MarkdownIt({ html: true, linkify: true });

// ---------------------------------------------------------------------------
// ページ構成(=章とファイルの対応)。原稿は入門編(Blockly版)の掲載順(manuscript_blockly/README.md)に従う。
// `md` は CHaser-Book からの相対パス。応用編(Python版)・索引(付録4)は対象外。
// ---------------------------------------------------------------------------

const manifest = [
  { slug: 'rules-01', group: 'part1', groupLabel: '第1部　CHaserを知る', title: 'CHaserとは', md: 'manuscript_shared/part1/01_chaser_toha.md' },
  { slug: 'rules-02', group: 'part1', groupLabel: '第1部　CHaserを知る', title: 'フィールドの構成要素', md: 'manuscript_shared/part1/02_field.md' },
  { slug: 'rules-03', group: 'part1', groupLabel: '第1部　CHaserを知る', title: 'プレイヤーの行動', md: 'manuscript_shared/part1/03_actions.md' },
  { slug: 'rules-04', group: 'part1', groupLabel: '第1部　CHaserを知る', title: 'アイテム取得とブロック出現', md: 'manuscript_shared/part1/04_item_block.md' },
  { slug: 'rules-05', group: 'part1', groupLabel: '第1部　CHaserを知る', title: '勝利条件', md: 'manuscript_shared/part1/05_win_conditions.md' },
  { slug: 'rules-06', group: 'part1', groupLabel: '第1部　CHaserを知る', title: 'チュートリアルの始め方', md: 'manuscript_blockly/part1/06_tutorial_start.md' },

  { slug: 'tutorial-00', group: 'part2', groupLabel: '第2部　チュートリアル', title: 'Blockly基本操作', md: 'manuscript_blockly/part2/01_basics.md', foldAnswers: true },
  { slug: 'tutorial-01', group: 'part2', groupLabel: '第2部　チュートリアル', title: '1章　移動', md: 'manuscript_blockly/part2/02_move.md', foldAnswers: true },
  { slug: 'tutorial-02', group: 'part2', groupLabel: '第2部　チュートリアル', title: '2章　繰り返し', md: 'manuscript_blockly/part2/03_loop.md', foldAnswers: true },
  { slug: 'tutorial-03', group: 'part2', groupLabel: '第2部　チュートリアル', title: '3章　フィールド情報を読み取る', md: 'manuscript_blockly/part2/04_mapinfo.md', foldAnswers: true },
  { slug: 'tutorial-04', group: 'part2', groupLabel: '第2部　チュートリアル', title: '4章　条件分岐', md: 'manuscript_blockly/part2/05_condition.md', foldAnswers: true },
  { slug: 'tutorial-05', group: 'part2', groupLabel: '第2部　チュートリアル', title: '5章　探査：近隣探査と遠方探査', md: 'manuscript_blockly/part2/06_search.md', foldAnswers: true },
  { slug: 'tutorial-06', group: 'part2', groupLabel: '第2部　チュートリアル', title: '6章　探査した情報で行動を決める', md: 'manuscript_blockly/part2/07_search_action.md', foldAnswers: true },
  { slug: 'tutorial-07', group: 'part2', groupLabel: '第2部　チュートリアル', title: '7章　ターンの仕組みとget_ready', md: 'manuscript_blockly/part2/08_turn.md', foldAnswers: true },
  { slug: 'tutorial-08', group: 'part2', groupLabel: '第2部　チュートリアル', title: '8章　ブロック設置とアタック攻撃', md: 'manuscript_blockly/part2/09_attack.md', foldAnswers: true },
  { slug: 'tutorial-09', group: 'part2', groupLabel: '第2部　チュートリアル', title: '9章　変数と関数を活用する', md: 'manuscript_blockly/part2/10_var_func.md', foldAnswers: true },
  { slug: 'tutorial-10', group: 'part2', groupLabel: '第2部　チュートリアル', title: '10章　総合演習', md: 'manuscript_blockly/part2/11_obstacle.md', foldAnswers: true },

  { slug: 'practice-01', group: 'part3', groupLabel: '第3部　実践', title: '1章　プログラミング画面の使い方', md: 'manuscript_blockly/part3/01_programming_screen.md' },
  { slug: 'practice-02', group: 'part3', groupLabel: '第3部　実践', title: '2章　対戦ルームの使い方', md: 'manuscript_blockly/part3/02_room_and_battle.md' },
  { slug: 'practice-03', group: 'part3', groupLabel: '第3部　実践', title: '3章　やりたいことをプログラムにする', md: 'manuscript_blockly/part3/03_strategies.md' },
];

const referencePages = [
  { slug: 'answers', title: '演習・確認クイズの解答', spoiler: true },
  { slug: 'tutorial-examples', title: 'チュートリアル解答例集', spoiler: true },
  { slug: 'glossary', title: '用語集', spoiler: false },
];

const readingOrder = ['index', ...manifest.map(m => m.slug)];

// ---------------------------------------------------------------------------
// Markdown 前処理・変換ヘルパー
// ---------------------------------------------------------------------------

function stripLeadingH1(markdown) {
  return markdown.replace(/^#[ \t]+[^\n]*\n+/, '');
}

// markdown-it は CommonMark の flanking 規則により、全角括弧や句読点の直後に
// 非空白・非句読点の文字(かな漢字など)が続く `**強調**` を太字として解釈できない
// ことがある(例: 「**周辺情報（get_ready）**の3つ」)。原稿は日本語の文中に
// `**` を多用するため、フェンス付きコードブロックを除いて先に <strong> へ
// 変換しておく。
function convertBoldEmphasis(markdown) {
  const parts = markdown.split(/(```[\s\S]*?```)/);
  return parts
    .map((part, idx) => (idx % 2 === 1 ? part : part.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')))
    .join('');
}

function renderMarkdown(markdown) {
  return md.render(convertBoldEmphasis(markdown));
}

function scaleWidthPercent(nn) {
  const scaled = Math.round(nn * 2.5);
  return Math.max(30, Math.min(100, scaled));
}

// 原稿中の `![alt](相対パス){width=NN%}` を、画像を public/images/guide/ 配下へ
// コピーしつつ <figure> の生HTMLに変換する。
function convertImages(markdown, mdAbsPath) {
  const imageRe = /!\[([^\]]*)\]\(([^)\s]+)\)(?:\{width=(\d+)%\})?/g;
  return markdown.replace(imageRe, (whole, alt, relSrc, widthPct) => {
    const srcAbs = path.resolve(path.dirname(mdAbsPath), relSrc);
    if (!fs.existsSync(srcAbs)) {
      console.warn(`  ! 画像が見つかりません: ${relSrc} (${path.relative(SITE_ROOT, mdAbsPath)})`);
      return whole;
    }
    const relUnderAssets = path.relative(ASSETS_IMAGES_ROOT, srcAbs);
    const destAbs = path.join(IMAGES_OUT_ROOT, relUnderAssets);
    fs.mkdirSync(path.dirname(destAbs), { recursive: true });
    fs.copyFileSync(srcAbs, destAbs);

    const publicUrl = '../images/guide/' + relUnderAssets.split(path.sep).join('/');
    const width = widthPct ? scaleWidthPercent(Number(widthPct)) : 60;
    const safeAlt = alt.replace(/"/g, '&quot;');
    const isRaw = relUnderAssets.split(path.sep).includes('tutorial_answers_raw');

    let imgTag = `<img src="${publicUrl}" alt="${safeAlt}" style="width:${width}%;max-width:640px" class="rounded-lg border border-gray-200 shadow-sm" loading="lazy">`;
    if (isRaw) {
      imgTag = `<a href="${publicUrl}" target="_blank" rel="noopener noreferrer" title="クリックで原寸大表示">${imgTag}</a>`;
    }
    const caption = alt ? `\n<figcaption class="mt-2 text-sm text-gray-500">${safeAlt}</figcaption>` : '';
    return `<figure class="my-6 flex flex-col items-center">\n${imgTag}${caption}\n</figure>`;
  });
}

// レンダリング後のHTMLから h2/h3/h4 見出しの一覧を抽出する。
// (h5/h6 は意図的に対象外: 見出しの「境界」は h2/h3/h4 のみで決める)
function extractHeadingBlocks(html) {
  const re = /<h([234])>([\s\S]*?)<\/h\1>/g;
  const blocks = [];
  let m;
  while ((m = re.exec(html))) {
    blocks.push({ level: Number(m[1]), text: m[2], tagStart: m.index, tagEnd: re.lastIndex });
  }
  return blocks;
}

// predicate に一致する見出しについて、その見出し「本文」(次の h2/h3/h4 見出しの
// 直前まで、内部の h5/h6 も含む)を <details> で折りたたむ。見出し自体は残す。
function foldMatchingSections(html, predicate, { requireImage = false, summaryLabel = '解答例を見る' } = {}) {
  const blocks = extractHeadingBlocks(html);
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    if (!predicate(b)) continue;
    const contentStart = b.tagEnd;
    const contentEnd = i + 1 < blocks.length ? blocks[i + 1].tagStart : html.length;
    const inner = html.slice(contentStart, contentEnd);
    if (!inner.trim()) continue;
    if (requireImage && !inner.includes('<img')) continue;
    const wrapped = `<details class="answer-details my-4 rounded-lg border border-amber-300 bg-amber-50"><summary class="cursor-pointer select-none rounded-lg px-4 py-3 font-semibold text-amber-800">${summaryLabel}</summary><div class="border-t border-amber-200 px-4 py-4">${inner}</div></details>`;
    html = html.slice(0, contentStart) + wrapped + html.slice(contentEnd);
  }
  return html;
}

function readManuscript(relPath) {
  return fs.readFileSync(path.join(BOOK_ROOT, relPath), 'utf8');
}

// ---------------------------------------------------------------------------
// 各ページ固有の変換
// ---------------------------------------------------------------------------

function buildChapterHtml(entry) {
  const mdAbsPath = path.join(BOOK_ROOT, entry.md);
  let raw = fs.readFileSync(mdAbsPath, 'utf8');
  raw = stripLeadingH1(raw);
  raw = convertImages(raw, mdAbsPath);
  let html = renderMarkdown(raw);
  if (entry.foldAnswers) {
    html = foldMatchingSections(html, b => b.level === 4 && b.text.trim() === '解答例');
  }
  return html;
}

// 付録1: 確認クイズ・演習問題の解答(入門編の原稿には、Python編の解答は含まれない)。
function buildAnswersHtml() {
  let raw = readManuscript('manuscript_blockly/appendix/01_answers.md');
  // 先頭の「# 付録」と、付録1〜4の概要リストを除去
  raw = raw.replace(/^#\s+付録\n[\s\S]*?(?=##\s+付録1)/, '');
  // 「## 付録1 ...」の見出し自体は除去(ページ側でタイトルを出すため)。以降の説明文は残す。
  raw = raw.replace(/^##\s+付録1[^\n]*\n/m, '');
  return renderMarkdown(raw);
}

// 付録2: 分割画像(_partN)をraw(分割前)画像へ差し替え、ステージごとに折りたたむ。
function buildTutorialExamplesHtml() {
  let raw = readManuscript('manuscript_blockly/appendix/02_tutorial_examples.md');
  raw = raw.replace(/^##\s+付録2[^\n]*\n/m, '');

  // 印刷用に画像を分割していた旨の記述を除去(Webでは分割しないため)
  raw = raw.replace(
    '本文第2部10章に対応する、これまでの集大成となる総合演習ステージです。ブロック数が多いため、8-2と8-3は画像を複数枚に分割して掲載しています。',
    '本文第2部10章に対応する、これまでの集大成となる総合演習ステージです。'
  );
  raw = raw.replace(
    /ブロック数が多いため、画像を3枚に分割して掲載します(?:（[^）]*）)?。/,
    ''
  );
  raw = raw.replace(
    /ブロック数が非常に多いため、画像を4枚に分割して掲載します(?:（[^）]*）)?。/,
    ''
  );
  // 執筆時点の内部メモ(未撮影について)は公開ページには不要なので除去
  raw = raw.replace(/^>\s*\*\*執筆メモ\*\*：[^\n]*\n\n?/m, '');

  // 分割画像(tutorial_answers/xxx_partN.png) → 分割前のraw画像(tutorial_answers_raw/xxx.png)
  raw = raw.replace(/tutorial_answers\/([a-zA-Z0-9_-]+)_part\d+\.png/g, 'tutorial_answers_raw/$1.png');
  // alt文中の「（1/3）」のような分割番号表記を除去
  raw = raw.replace(/(!\[[^\]]*?)(?:\s*[（(]\d+[\/／]\d+[）)])+(\])/g, '$1$2');

  // 上の置換で同一画像を指す行が連続することがあるため、連続する重複画像行を1つにまとめる
  const lines = raw.split('\n');
  const outLines = [];
  let lastImgSrc = null;
  for (const line of lines) {
    const trimmed = line.trim();
    const imgMatch = trimmed.match(/^!\[[^\]]*\]\(([^)]+)\)(?:\{width=\d+%\})?$/);
    if (imgMatch) {
      const src = imgMatch[1];
      if (src === lastImgSrc) continue;
      lastImgSrc = src;
      outLines.push(line);
    } else {
      if (trimmed !== '') lastImgSrc = null;
      outLines.push(line);
    }
  }
  raw = outLines.join('\n');

  const mdAbsPath = path.join(BOOK_ROOT, 'manuscript_blockly/appendix/02_tutorial_examples.md');
  raw = convertImages(raw, mdAbsPath);

  let html = renderMarkdown(raw);
  html = foldMatchingSections(html, b => b.level === 4 && /^\d+-\d+/.test(b.text.trim()), { requireImage: true });
  return html;
}

function buildGlossaryHtml() {
  let raw = readManuscript('manuscript_blockly/appendix/03_glossary.md');
  raw = raw.replace(/^##\s+付録3[^\n]*\n/m, '');
  return renderMarkdown(raw);
}

// ---------------------------------------------------------------------------
// ページテンプレート
// ---------------------------------------------------------------------------

function renderToc(currentSlug) {
  const groups = [
    { label: '第1部　CHaserを知る', items: manifest.filter(m => m.group === 'part1') },
    { label: '第2部　チュートリアル', items: manifest.filter(m => m.group === 'part2') },
    { label: '第3部　実践', items: manifest.filter(m => m.group === 'part3') },
    { label: '資料', items: referencePages },
  ];
  const topLink = `<li class="mb-3"><a href="./index.html" class="${currentSlug === 'index' ? 'font-bold text-blue-700' : 'font-semibold text-gray-800 hover:text-blue-600'}">解説トップ</a></li>`;
  const body = groups.map(g => `
    <div class="mb-4">
      <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">${g.label}</p>
      <ul class="space-y-1">
        ${g.items.map(it => `<li><a href="./${it.slug}.html" class="${it.slug === currentSlug ? 'font-bold text-blue-700' : 'text-gray-700 hover:text-blue-600'}">${it.title}</a></li>`).join('\n')}
      </ul>
    </div>`).join('\n');
  return `<ul class="mb-2">${topLink}</ul>${body}`;
}

function renderPrevNext(slug) {
  const idx = readingOrder.indexOf(slug);
  if (idx === -1) return '';
  const prevSlug = idx > 0 ? readingOrder[idx - 1] : null;
  const nextSlug = idx < readingOrder.length - 1 ? readingOrder[idx + 1] : null;
  const titleOf = s => (s === 'index' ? '解説トップ' : manifest.find(m => m.slug === s)?.title ?? s);
  const prevHtml = prevSlug
    ? `<a href="./${prevSlug}.html" class="text-blue-600 hover:underline">← ${titleOf(prevSlug)}</a>`
    : '<span></span>';
  const nextHtml = nextSlug
    ? `<a href="./${nextSlug}.html" class="text-blue-600 hover:underline sm:text-right">${titleOf(nextSlug)} →</a>`
    : '<span></span>';
  return `<div class="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm sm:flex-row sm:justify-between">${prevHtml}${nextHtml}</div>`;
}

function renderShell({ slug, title, description, breadcrumb, contentHtml, spoiler = false, spoilerText = '' }) {
  const spoilerBanner = spoiler
    ? `<div class="mb-6 rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-amber-900">
        <p class="font-semibold">⚠️ ネタバレ注意</p>
        <p class="mt-1 text-sm">${spoilerText || 'このページには演習・チュートリアルの解答が含まれています。自分で挑戦する前に読むと、考える楽しみが減ってしまいます。'}</p>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | CHaser解説（Blockly編） | U-15 プログラミングコンテスト 舞鶴大会</title>
  <meta name="description" content="${description}">
  <link rel="icon" href="../images/favicon.ico" sizes="any">
  <link rel="icon" href="../images/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="../images/apple-touch-icon.png">
  <link rel="stylesheet" href="../src/style.css">
</head>
<body class="bg-white text-gray-800">
  <header class="border-b border-gray-200 bg-white">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
      <a href="./index.html" class="text-lg font-bold">CHaser解説（Blockly編）</a>
      <nav class="flex items-center gap-4 text-sm font-semibold">
        <a href="./index.html" class="hover:text-blue-600">目次</a>
        <a href="../competition.html" class="hover:text-blue-600">大会サイトへ戻る</a>
      </nav>
    </div>
  </header>

  <div class="mx-auto max-w-5xl px-4 py-8 lg:flex lg:items-start lg:gap-8">
    <aside class="mb-8 lg:mb-0 lg:w-64 lg:shrink-0">
      <details open class="rounded-lg border border-gray-200 bg-gray-50 lg:border-0 lg:bg-transparent">
        <summary class="cursor-pointer select-none rounded-lg px-4 py-3 font-semibold lg:hidden">目次</summary>
        <nav class="px-4 pb-4 text-sm lg:sticky lg:top-8 lg:px-0 lg:pb-0">
          ${renderToc(slug)}
        </nav>
      </details>
    </aside>

    <main class="min-w-0 flex-1">
      ${breadcrumb ? `<p class="mb-2 text-sm text-gray-500">${breadcrumb}</p>` : ''}
      <h1 class="mb-6 text-3xl font-bold">${title}</h1>
      ${spoilerBanner}
      <article class="prose prose-blue max-w-none prose-img:mx-auto">
        ${contentHtml}
      </article>

      ${renderPrevNext(slug)}

      <div class="mt-8 rounded-lg bg-gray-50 p-4 text-sm">
        <p class="font-semibold">参考資料</p>
        <ul class="mt-2 flex flex-wrap gap-x-6 gap-y-1">
          <li><a class="text-blue-600 hover:underline" href="./answers.html">演習・確認クイズの解答</a></li>
          <li><a class="text-blue-600 hover:underline" href="./tutorial-examples.html">チュートリアル解答例集</a></li>
          <li><a class="text-blue-600 hover:underline" href="./glossary.html">用語集</a></li>
        </ul>
      </div>
    </main>
  </div>

  <footer class="mt-12 border-t border-gray-200 bg-gray-800 py-6 text-center text-sm text-gray-300">
    <p>Copyright &copy; U-15 プログラミングコンテスト 舞鶴大会</p>
  </footer>
</body>
</html>
`;
}

function writePage(slug, options) {
  const html = renderShell({ slug, ...options });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.html`), html, 'utf8');
  console.log(`  guide/${slug}.html`);
}

// ---------------------------------------------------------------------------
// index.html (目次トップページ) ― 原稿の「はじめに」を Blockly版向けに要約して手書き
// ---------------------------------------------------------------------------

function renderCardGrid(items) {
  return `<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    ${items.map(it => `<a href="./${it.slug}.html" class="hover-card block rounded-xl bg-white p-4">
      <p class="font-semibold text-blue-700">${it.title}</p>
    </a>`).join('\n')}
  </div>`;
}

function buildIndexHtml() {
  const part1Items = manifest.filter(m => m.group === 'part1');
  const part2Items = manifest.filter(m => m.group === 'part2');
  const part3Items = manifest.filter(m => m.group === 'part3');

  return `
  <p>この解説は、対戦型プログラミング競技 <strong>CHaser（チェイサー）</strong> を、Blocklyでのブロック組み立てを通してはじめて触る人のための入門書です。CHaserでは、あなたが組んだプログラムがフィールド上のキャラクターを代わりに動かします。試合が始まったら直接操作はできません。「相手がこう来たら、自分はこう動く」という判断をあらかじめプログラムとして組み立てておく――そのための考え方を、ルール解説からチュートリアル、実際の対戦画面の使い方、やりたいことをプログラムにする手順まで順番に説明します。</p>

  <p>いちばんおすすめの読み方は、<strong>第1部 → 第2部 → 第3部</strong>の順番です。第1部でルールを理解してから、第2部でBlocklyのステージに挑戦し、第3部で本番の対戦準備と、自分の戦略をプログラムにする考え方を確認します。とにかく早く対戦したいときは、第3部の1章・2章を先に読んでも構いません。</p>

  <div class="my-6 rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-amber-900">
    <p class="font-semibold">⚠️ 読み進める前に</p>
    <p class="mt-1 text-sm">第2部の各ステージは、それ自体が「どう組めばクリアできるか」を考えるパズルです。各ページの「解答例」は折りたたんであります。<strong>先に自分でBlockly画面を開いて組んでみてから</strong>、解答例を開いて見比べることをおすすめします。答えを先に見てしまうと、いちばん面白いところを飛ばすことになります。</p>
  </div>

  <h2>第1部　CHaserを知る</h2>
  <p>対戦ルール、フィールド、勝敗の決まり方、チュートリアルの始め方を説明します。まずはここから。</p>
  ${renderCardGrid(part1Items)}

  <h2 class="mt-10">第2部　チュートリアル</h2>
  <p>ブロックを組み立ててステージをクリアする方法を、章ごとに説明します。各章に「課題 → 考えるヒント → 解答例（折りたたみ）」の順で書かれています。</p>
  ${renderCardGrid(part2Items)}

  <h2 class="mt-10">第3部　実践</h2>
  <p>チュートリアルを終えたら、本番のプログラミング画面と対戦ルームの使い方を確認しましょう。3章では、「こう動かしたい」というアイデアをブロックのプログラムにする考え方を、例を交えて説明します。</p>
  ${renderCardGrid(part3Items)}

  <h2 class="mt-10">資料</h2>
  <p>自分の答え合わせや、用語の確認に使ってください。</p>
  ${renderCardGrid(referencePages)}
  `;
}

// ---------------------------------------------------------------------------
// メイン処理
// ---------------------------------------------------------------------------

function main() {
  // 原稿から参照されなくなった画像が残らないよう、画像は毎回作り直す
  fs.rmSync(IMAGES_OUT_ROOT, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_OUT_ROOT, { recursive: true });

  console.log('guide ページを生成します...');

  writePage('index', {
    title: '解説トップ',
    description: 'CHaser入門編（Blockly版）の解説トップページ。ルール解説、Blocklyチュートリアル、実践編の目次です。',
    breadcrumb: '',
    contentHtml: buildIndexHtml(),
  });

  for (const entry of manifest) {
    writePage(entry.slug, {
      title: entry.title,
      description: `CHaser解説（Blockly編） ${entry.groupLabel} ${entry.title}`,
      breadcrumb: entry.groupLabel,
      contentHtml: buildChapterHtml(entry),
      spoiler: Boolean(entry.foldAnswers),
      spoilerText: '各ステージの「解答例」は折りたたんであります。自分の力で挑戦してから開いてください。',
    });
  }

  writePage('answers', {
    title: '演習・確認クイズの解答',
    description: 'CHaser解説（Blockly編） 第1部・第2部・第3部の演習問題・確認クイズの解答です。',
    breadcrumb: '資料',
    contentHtml: buildAnswersHtml(),
    spoiler: true,
    spoilerText: 'このページには第1部・第2部・第3部の演習問題・確認クイズの解答が含まれています。',
  });

  writePage('tutorial-examples', {
    title: 'チュートリアル解答例集',
    description: 'CHaser解説（Blockly編） チュートリアル全ステージ（1-1〜9-3）のBlockly解答例集です。',
    breadcrumb: '資料',
    contentHtml: buildTutorialExamplesHtml(),
    spoiler: true,
    spoilerText: 'このページには全ステージの解答例が掲載されています。自分で組んだプログラムと見比べたいときに開いてください。',
  });

  writePage('glossary', {
    title: '用語集',
    description: 'CHaser解説（Blockly編） 用語集。',
    breadcrumb: '資料',
    contentHtml: buildGlossaryHtml(),
  });

  console.log('完了しました。');
}

main();
