---
title: Astro6 + cloudflare workersへの移行
id: veey2BG3T0d
public: true
publishedAt: 2026-03-19
description:
tags:
  - astro
  - cloudflare
  - tech
  - web
---
最近Astroの開発元がCloudflareに買収され、Astro6がリリースされた。
pagesが非推奨になり、近い将来workersへの移行を検討していた矢先の出来事だったので、丁度良い機会だと思い移行作業を行った。

公式が提供している [Upgrade to Astro v6](https://docs.astro.build/en/guides/upgrade-to/v6/) を参考にすればスムーズに進められた。
多少のファイル編集をすれば元通り動作するようになったが、元プロジェクトで利用していた一部のパッケージは最新のAstroに未対応だったのでプロジェクトから削除した。

pagesからworkersへの移行も [Deploy your Astro Site to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) を参考に進め、pages側のドメイン設定削除、自動ビルド設定の解除を行えばお終い。
これほど楽だった移行作業はないね。