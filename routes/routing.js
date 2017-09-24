var Note = require('../models/Note.js')
var Article = require('../models/Article.js')
var request = require("request")
var cheerio = require("cheerio")


module.exports = function(app, db){

    //Post route to scrape the articles from the website
    app.post('/scrape',function(req, res){
        console.log("in scrape")
        var articles = 0, counter = 0;
        //Article.find({saved: false}).remove().exec()
        request("https://arstechnica.com/", function(error, response, html){
            var $ = cheerio.load(html)
            var elements = $("article header").nextAll()

            //counter variable to identify number of elements scraped
            var counter = elements.length
            console.log("cheerio"+counter)

            //loop through the intended headline elements
            $("article header").each(function(i, element){
                var item = {}

                item.title = $(element).find("h2 a").text()
                item.link = $(element).find("h2 a").attr("href")
                item.excerpt = $(element).find(".excerpt").text()
                
                //save it to the Article db which has unique params to be able to identify duplicate
                var newArticle = new Article(item)
                newArticle.save(function(err, data){
                    //if error it means the article was not saved to db so reduce the counter
                    if(err){
                        //console.log(err)
                        counter--
                    }
                    else{
                        //if not error increase the articles count to track number of articles saved to db
                        articles++
                    }
                    //when articles/counter match then we have reached the end of loop so the response can be sent to browser
                    if(articles===counter-1){
                        console.log("article", articles)
                        if(articles>0){
                            res.send(articles + " New articles added")
                        }
                        else{
                            res.send("No new articles added, checkback later")
                        }
                        
                    }    
                })
            })
        })
    })

    //Get route to get the articles from the database which are NOT saved by the user
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

    //Get route to get the articles from the database which are saved by the user
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

    //Post route to be able to save an article selected by user
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

    //Post route to be able to delete an article saved previously by user 
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

    //Get route to send the notes of an article to display in add notes section
    app.get('/notes/:id', function(req, res){
        Article.findOne({ "_id": req.params.id })
        .populate("note").exec(function(err, data){
            if(err){
                console.log(err)
            }
            else{
                //console.log("get notes", data.note)
                res.json(data.note)
            }
        })
    })

    //Post route to save the notes of an article entered by user
    app.post('/addNote/:id', function(req, res){
        console.log("req", req.params.id)
        var newNote = new Note(req.body)
        console.log("newNote", newNote)
        newNote.save(function(err, notedata){
            if(err){
                console.log(err)
            }
            else{
                Article.findOneAndUpdate({"_id": req.params.id}, {$push: {"note": notedata._id}}, {new: true}, function(err, articledata){
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.send(articledata)
                    }
                })
            }
        })
    })

    //Post route to delete the notes of an article selected by user    
    app.post('/deleteNote/:id/:aid', function(req,res){
        Note.find({"_id":req.params.id}).remove(function(err, data){
            if(err){
                console.log(err)
            }
            else {
                res.redirect("/notes/"+req.params.aid)
            }
            
        })
        
    })

}

