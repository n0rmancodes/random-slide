const got = require("got");
const cheerio = require("cheerio");
const fs = require("fs");

grab();

function grab() {
    var words = fs.readFileSync("./words.txt").toString().split(`\n`);
    var randomWord = words[Math.floor(Math.random()*words.length)];
    
    var url = "https://www.slideshare.net/search/slideshow?searchfrom=header&q=" + randomWord;
    got(url).then(function(response) {
        var $ = cheerio.load(response.body);
        if ($(".notice-no-results")[0]) {
            grab();
            return;
        } else {
            var items = $(".searchResults .columns ul li div a");
            var randomSlide = items[Math.floor(Math.random()*items.length)];
            if (randomSlide.attribs.href) {
                var url2 = "https://www.slideshare.net" + randomSlide.attribs.href;
                got(url2).then(function(response) {
                    var $ = cheerio.load(response.body);
                    var max = parseInt($("#total-slides")[0].children[0].data);
                    var rs = Math.floor(Math.random() * max) + 1;
                    var imgsrc = $(".slide_image")[0].attribs.src;
                    var final = imgsrc.replace("-1-", "-" + rs + "-");
                    var title = $(".j-title-breadcrumb").text();
                    var author = $(".author-text h2 a span").text();
                    console.log(final);
                    console.log("================");
                    console.log("title: " + title);
                    console.log("url: " + url2);
                    console.log("author: " + author);
                    console.log("query: " + randomWord);
                })
            }
        }
    })
}