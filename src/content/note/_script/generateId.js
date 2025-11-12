/**
 * Obsidian Templater用のカスタムスクリプト
 * このファイルをTemplaterの「User Scripts」に設定してください
 * 
 * 設定方法:
 * 1. Obsidian設定 > Templater > User Script Functions
 * 2. Script files folder locationを `src/content/note/_template/scripts` に設定
 */

function generateId() {
  // Sqidsライブラリの代わりに、簡易的なID生成を実装
  // より安全なID生成のためには、Sqidsライブラリをビルドして使用することを推奨
  
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  
  // Base62エンコード (簡易版)
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const base = chars.length;
  
  function encode(num) {
    if (num === 0) return chars[0];
    let result = '';
    while (num > 0) {
      result = chars[num % base] + result;
      num = Math.floor(num / base);
    }
    return result;
  }
  
  const id = encode(timestamp) + encode(random);
  
  // 最小8桁を保証
  return id.padStart(8, '0');
}

module.exports = generateId;
