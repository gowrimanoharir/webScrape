var Note = require('../models/Note.js')
var Article = require('../models/Article.js')
var request = require("request")
var cheerio = require("cheerio")


module.exports = function(app, db){

    app.post('/scrape',function(req, res){
        console.log("in scrape")
        var articles = 0, counter = 0;
        //Article.find({saved: false}).remove().exec()
        request("https://arstechnica.com/", function(error, response, html){
            var $ = cheerio.load(html)
            var elements = $("article header").nextAll()
            var counter = elements.length
            console.log("cheerio"+counter)
            $("article header").each(function(i, element){
                var item = {}

                item.title = $(element).find("h2 a").text()
                item.link = $(element).find("h2 a").attr("href")
                item.excerpt = $(element).find(".excerpt").text()
                var newArticle = new Article(item)
                newArticle.save(function(err, data){
                    if(err){
                        //console.log(err)
                        counter--
                    }
                    else{
                        articles++
                    }
                    if(articles===counter-1){
                        console.log("article", articles)
                        if(articles>0){
                            res.send(articles + "articles added")
                        }
                        else{
                            res.send("no new article")
                        }
                        
                    }    
                })
            })
        })
    })

    app.get('/articles', function(req, res){

        Article.find({saved: false}, function(err, data){
            if(err){
                console.log(err)
            }
            else{
                res.json(data)
            }
        })
    })

    app.get('/saved', function(req, res){
        Article.find({saved: true}, function(err, data){
            if(err){
                console.log(err)
            }
            else{
                res.json(data)
            }
        })
    })

    app.post('/save/:id', function(req,res){
        Article.update({"_id":req.params.id}, {$set: {"saved": true}}, function(err, data){
            if(err){
                console.log(err)
            }
            else{
                res.redirect("/articles")
            }
        })
    })

    app.post('/delete/:id', function(req,res){
        Article.find({"_id":req.params.id}).remove(function(err, data){
            if(err){
                console.log(err)
            }
            else {
                res.redirect("/saved")
            }
            
        })
        
    })

}

