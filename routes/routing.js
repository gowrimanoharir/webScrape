var Note = require('../models/Note.js')
var Article = require('../models/Article.js')
var request = require("request")
var cheerio = require("cheerio")
var articles = []


module.exports = function(app, db){

    app.get('/scrape',function(req, res){
        request("https://arstechnica.com/", function(error, response, html){
            var $ = cheerio.load(html)

            $("article header").each(function(i, element){
                var item = {}

                item.title = $(element).find("h2 a").text()
                item.link = $(element).find("h2 a").attr("href")
                item.excerpt = $(element).find(".excerpt").text()
                articles.push(item)
            })
            res.json(articles)
        })

    })

    app.post('/save', function(req,res){
        var newArticle = new Article(req.body)

        newArticle.save(function(err, data){
            if(err){
                console.log(err)
            }
            else{
                console.log(data)
            }
        })
    })

}

