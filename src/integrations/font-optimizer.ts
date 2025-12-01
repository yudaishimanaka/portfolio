import type { AstroIntegration } from 'astro';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const LIMIT_CHARS = 1000;

/**
 * Google Fontsを最適化するAstroインテグレーション
 * ビルド時にHTMLファイルから実際に使用されている文字を抽出し、
 * Google FontsのURLに&text=パラメータを追加して必要な文字のみを読み込むようにします
 */
export default (): AstroIntegration => ({
  name: 'font-optimizer',
  hooks: {
    'astro:build:done': async ({ routes }) => {
      console.log('🔤 Font Optimizer: Starting font optimization...');
      
      for (const route of routes) {
        try {
          const distURLs = route.distURL;
          if (!distURLs || distURLs.length === 0) continue;
          
          // URLからファイルパスに変換
          const filePath = fileURLToPath(distURLs[0]);
          
          // HTMLファイルのみ処理
          if (filePath && filePath.endsWith('.html')) {
            const htmlContent = await fs.readFile(filePath, 'utf-8');
            
            // JSDOMでHTMLをパース
            const dom = new JSDOM(htmlContent);
            const document = dom.window.document;
            
            // bodyタグ内のテキストを抽出してエンコード
            const { uniqueText, encodedText } = await extractBodyTextAndEncode(filePath);
            
            // 文字数制限チェック
            if (uniqueText.length > LIMIT_CHARS) {
              console.warn(
                `⚠️  Skipping ${filePath}: Text length (${uniqueText.length}) exceeds ${LIMIT_CHARS} characters limit.`
              );
              continue;
            }
            
            // Google Fontsの<link>タグを検索
            const linkTag = document.querySelector<HTMLLinkElement>(
              'link[href*="https://fonts.googleapis.com/css2?family="]'
            );
            
            if (linkTag) {
              const originalHref = linkTag.getAttribute('href') || '';
              const newHref = originalHref.includes('&text=')
                ? originalHref.replace(/&text=.*$/, `&text=${encodedText}`)
                : `${originalHref}&text=${encodedText}`;
              
              linkTag.setAttribute('href', newHref);
              
              console.log(`✅ Optimized: ${filePath} (${uniqueText.length} unique chars)`);
              
              // ファイルを上書き保存
              await fs.writeFile(filePath, dom.serialize(), 'utf-8');
            } else {
              console.log(`ℹ️  No Google Fonts link found: ${filePath}`);
            }
          }
        } catch (error) {
          console.error(
            `❌ Error processing file ${route.distURL?.[0]?.pathname}:`,
            error instanceof Error ? error.message : String(error)
          );
        }
      }
      
      console.log('✨ Font Optimizer: Optimization complete!');
    },
  },
});

/**
 * HTMLファイルからbodyタグ内のテキストを抽出し、URLエンコードします
 * @param filePath - HTMLファイルのパス
 * @returns ユニークなテキストとURLエンコードされたテキスト
 */
export const extractBodyTextAndEncode = async (
  filePath: string
): Promise<{ uniqueText: string; encodedText: string }> => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const dom = new JSDOM(data);
    const body = dom.window.document.body;
    
    if (!body) {
      throw new Error('No <body> tag found in the HTML file.');
    }
    
    // <script>タグを除外
    const scriptTags = body.querySelectorAll('script');
    scriptTags.forEach((script) => script.remove());
    
    // body内のテキストを取得
    const textContent = body.textContent?.trim() ?? '';
    
    // data-text属性からもテキストを抽出
    const dataTextElements = body.querySelectorAll('[data-text]');
    const dataTextContent = Array.from(dataTextElements)
      .map((el) => el.getAttribute('data-text') || '')
      .join('');
    
    // bodyのテキストとdata-textのテキストを結合
    const combinedText = textContent + dataTextContent;
    
    // 全角スペースと半角スペースを除外し、改行や連続する空白を削除
    const normalizedText = combinedText
      .replace(/[\u3000\s]+/g, '')
      .replace(/\n+/g, '');
    
    // 重複を除去してユニークな文字列を作成
    const uniqueText = Array.from(new Set(normalizedText.split(''))).join('');
    
    // URLエンコード
    const encodedText = encodeURIComponent(uniqueText);
    
    return { uniqueText, encodedText };
  } catch (error) {
    throw new Error(
      `Failed to extract text from ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
