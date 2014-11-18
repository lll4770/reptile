var request = require('request'),
    cheerio = require('cheerio'),
    http = require('http'),
    url = require('url'),
    fs = require('fs');

var host = 'http://www.17u.com/blog/';//可修改为其他的地址



var html = [];
setInterval(scraper(host), 1000*60*15);//15 分钟更新一次
function scraper (host) {
  request(host, function (error, response, data) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(data);
      var raiderTitle = [],
          nav = [],
          body = [],
          hrefs = [];
      //删除无用数据
      $('.title').remove();
      $('.pic-info').remove();
      $('.count').remove();
      $('sup').remove();
      //筛选有用数据
      $('#raiderDiv .youjiSeed').each(function (i) {
            raiderTitle[i]=$(".youjiDiv h4 a").eq(i).text();
            nav.push("<span><a href='/" + i + "'>" + raiderTitle[i] + "</a></span>"); 
            hrefs[i] = $(".youjiDiv h4 a").eq(i)[0].prev.next.attribs.href;
            //写文件 将游记内容存放到本地
          /*request(hrefs[i],function(error,res,datas){
                var $raiderDetail = cheerio.load(datas);
                //console.log($raiderDetail("#grayCenter").text());
                fs.writeFile("raider"+i+".txt",$raiderDetail("#grayCenter").text(),function(err){
                    if(err) throw err;
                    console.log("raider"+i + " Saved!");
                });
                                
            });*/
            body.push("<span><a href='/" + i + "'>" + hrefs[i] + "</a></span>"); 
      });

      var len = raiderTitle.length;
      var title = "游记数";
      for (var i = 0; i < len;  i++) {
        html[i] = "" +
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "<meta charset='UTF-8' />" +
        "<title>" + title + "</title>" +
        "<style type='text/css'>" +
        "body{width:600px;margin:2em auto;font-family:'Microsoft YaHei';}" +
        "p{line-height:24px;margin:1em 0;}" +
        "header{border-bottom:1px solid #cccccc;font-size:2em;font-weight:bold;padding-bottom:.2em;}" +
        "nav{float:left;font-family:'Microsoft YaHei';margin-left:-12em;width:9em;text-align:right;}" +
        "nav a{display:block;text-decoration:none;padding:.7em 1em;color:#000000;}" +
        "nav a:hover{background-color:#003f00;color:#f9f9f9;-webkit-transition:color .2s linear;}" +
        "</style>" +
        "</head>" +
        "<body>" +
        "<header>" + raiderTitle[i] + "</header>" +
        "<nav>" + nav.join('') + "</nav>" +
        "<article>" + body[i] + "</article>" +
        "</body>" +
        "</html>";
      }
    }
  });
}

http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  path = path == '/' ? 0 : parseInt(path.slice(1));
  res.writeHead(200, {"Content-Type":"text/html"});
  res.end(html[path]);
}).listen(3000);

console.log('Server running at localhost:3000');
