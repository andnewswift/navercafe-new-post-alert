const Bot = BotManager.getCurrentBot();
const message = '새글 알림'+'\u200b'.repeat(500)+'\n';
const KEY = 'Vj4jD4n5lUf9g2I0y7QyilPDPiiusHJb5kTdZDV7b2UUARhPFXPxPdRXtgK3Ej8k';
const LoadingCycle = 1000;//불러오는 주기 ms단위(1초 == 1000ms)
const CafeNum = 29537083;
const Room = 'Hibot 실험방';
const KTPackage = 'com.kakao.tala';//카카오톡 패키지 명
let looper, articleNum;
/**
 * @param url 원본 Api url(md, msgpad없이)
 * @param time unix timestemp로 된 시간
 * @returns String md와 msgpad가 추가된 url
 */
function getUrl(u,t){
    let m=javax.crypto.Mac.getInstance('HmacSHA1');
    m.init(new javax.crypto.spec.SecretKeySpec(new java.lang.String(KEY).getBytes(),'HmacSHA1'));
    return (u.includes('?')?u+'&':u+'?')+'msgpad='+t+'&md='+encodeURIComponent(java.util.Base64.getEncoder().encodeToString(m.doFinal(new java.lang.String(u.substring(0,Math.min(255,u.length))+t).getBytes())));
}
articleNum = 0 + org.jsoup.Jsoup.connect(getUrl('https://apis.naver.com/cafemobileapps/cafe/ArticleList.xml?search.clubid=' + CafeNum + '&search.menuid=&search.perPage=5&search.queryType=lastArticle&moreManageMenus=true',new Date().getTime() + '')).ignoreContentType(true).parser(org.jsoup.parser.Parser.xmlParser()).get().select('article:first-child > articleid').text();

looper = setInterval(() => {
    try {
        let a = message;
        let response = org.jsoup.Jsoup.connect(getUrl('https://apis.naver.com/cafemobileapps/cafe/ArticleList.xml?search.clubid=' + CafeNum + '&search.menuid=&search.perPage=5&search.queryType=lastArticle&moreManageMenus=true',new Date().getTime() + '')).ignoreContentType(true).parser(org.jsoup.parser.Parser.xmlParser()).get();
        let articles= response.select('article');
        if(0 + response.select('article:first-child > articleid').text() > articleNum){
            articles.forEach(element => {
                if(0 + element.select('articleid').text() <= articleNum) return;
                a += '게시판: ' + org.jsoup.parser.Parser.unescapeEntities(element.select('menuname').text(), true) + '\n';
                a += '제목: ' + org.jsoup.parser.Parser.unescapeEntities(element.select('subject').text(), true) + '\n';
                a += '닉네임: ' + org.jsoup.parser.Parser.unescapeEntities(element.select('nickname').text(), true) + '\n';
                a += '아이디: ' + org.jsoup.parser.Parser.unescapeEntities(element.select('writerid').text(), true) + '\n';
                a += '읽음: ' + element.select('readCount').text() + '명\n';
                a += '댓글: ' + element.select('commentCount').text() + '개\n';
                a += element.select('writedate').text() + '\n';
                a += '\n';
            });
            Bot.send(Room, a, KTPackage);
            articleNum = 0 + response.select('article:first-child > articleid').text();
        }
    } catch (e) {
        Log.e(e);
    }
}, LoadingCycle);
function onStartCompile() {
    clearInterval(looper);
}
Bot.addListener(Event.START_COMPILE, onStartCompile);
