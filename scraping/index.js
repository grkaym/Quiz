import fs from "fs";
import fetch from "node-fetch";
import jsdom from "jsdom";
import iconv from "iconv-lite";
const { JSDOM } = jsdom;

(async () => {
    let quiz = [];
    for(let page = 1; page <= 8; page++) {
        const res = await fetch(`http://www.chukai.ne.jp/~shintaku/hayaoshi/haya00${page}.htm`, { encoding: "null" });
        const arrayBuffer = await res.arrayBuffer(); // バイナリデータを取得
        const buffer = Buffer.from(arrayBuffer);
        const body = iconv.decode(buffer, "Shift_JIS"); // Shift-JISからUTF-8に変換
        const dom = new JSDOM(body); // パース
        const question = dom.window.document.querySelectorAll("table tr td:nth-child(2)"); // JavaScriptと同じ書き方
        const answer = dom.window.document.querySelectorAll("table tr td:nth-child(3)"); // JavaScriptと同じ書き方
    
        // NodeList内の各要素のtextContentを取得して表示
        for(let i = 1; i < question.length; i++) {
            quiz.push([question[i].textContent, answer[i].textContent]);
        }
    }
    // ファイルに内容を書き込む
    const outputFile = "./output.txt";
    fs.writeFile(outputFile, JSON.stringify(quiz), err => {
        if(err) {
            console.error("ファイルの書き込みエラー:", err);
        }else {
            console.log("ファイルに内容が書き込まれました");
        }
    });
})();