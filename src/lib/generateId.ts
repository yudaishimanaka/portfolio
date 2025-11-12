import Sqids from 'sqids';

/**
 * 最小8桁のユニークIDを生成
 * Obsidianのtemplater機能で使用される
 */
export function generateId(): string {
  const sqids = new Sqids({
    minLength: 8, // 最小8桁
  });
  
  // タイムスタンプとランダム値を組み合わせてユニークなIDを生成
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  
  return sqids.encode([timestamp, random]);
}
