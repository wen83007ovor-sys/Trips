#!/usr/bin/env bash
#
# 部署前置腳本：自動把 index.html / js/*.js 裡的快取版本號（?v=N）
# 換成新的時間戳記，讓使用者的瀏覽器在部署新版後會重新抓取最新的
# CSS/JS，不會卡在舊快取。
#
# 這個腳本會把 index.html 與 js/*.js 「目前磁碟上的完整內容」一起
# git commit，所以請在確定這些檔案的其他修改也是這次要部署的內容
# 之後，再執行這支腳本。腳本只會建立 commit，不會自動 git push，
# 請自行檢查後手動推送。
#
# 用法：./scripts/deploy.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

NEW_VERSION="$(date -u +%Y%m%d%H%M%S)"

echo "產生新版本號：$NEW_VERSION"

# 只替換我們自己加上的 ?v=<數字> 快取版本號，CDN 第三方函式庫網址
# （版本號寫在路徑裡，不是 ?v= 這種 query string）不會被誤觸。
sed -i -E "s/\?v=[0-9]+/?v=${NEW_VERSION}/g" index.html js/*.js

if git diff --quiet -- index.html js/*.js; then
    echo "版本號沒有變化（可能同一秒內重複執行），略過 commit。"
    exit 0
fi

git add index.html js/*.js
git commit -m "chore: bump asset version to ${NEW_VERSION}"

echo ""
echo "已建立 commit，版本號更新為 ${NEW_VERSION}。"
echo "尚未推送，確認無誤後請自行執行：git push"
