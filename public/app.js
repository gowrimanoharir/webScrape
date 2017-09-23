var articles = $("#articles")
var saved = $("#saved-articles")

$(document).ready(function(){
    $.getJSON("/articles", function(data){
        showandhide(articles, saved)
        articles.html('')
        displayArticles(data);
    })
})


function showandhide(div1, div2){
    div1.show()
    div2.hide()
}

$("#scrape").on("click", function(){
    console.log("in scrape")
    $.post("/scrape")
    .done(function(data){
        console.log("in scrape",data)
        $.getJSON("/articles", function(data){
            showandhide(articles, saved)
            articles.html('')
            displayArticles(data);
        })
        alert(data)
    })
})

$("#articles").on("click", "#save-article", function(){
    var id = $(this).attr("data-id")
    $.post("/save/"+id)
    .done(function(data){
        showandhide(articles, saved)
        articles.html('')
        displayArticles(data);
    })
})

$("#saved-articles").on("click", "#delete-article", function(){
    var id = $(this).attr("data-id")
    console.log(id, "delete")
    $.post("/delete/"+id)
        .done(function(data){
            showandhide(saved, articles)
            saved.html('')
            //displaySavedArticles(data);
            displayArticles(data);
        })
})

$("#saved").on("click", function(){
    $.getJSON("/saved", function(data){
        showandhide(saved, articles)
        saved.html('')
        //displaySavedArticles(data);
        displayArticles(data);
    })
})

$("#home").on("click", function(){
    showandhide(articles, saved)
})

function displayArticles(data){
    console.log(data)
    //articles.html('')
    data.map(function(item, i) {
            var newArticle=$("<article>")
            var h2=$("<h2>")
            var h4 =$("<h4>")
            var a=$("<a>")
            var button = $("<button>")
            a.text(item.title)
            a.attr("href", item.link)
            h2.append(a)
            h4.text(item.excerpt)
        if(!item.saved){            
            button.text("Save Article")
            button.attr("id", "save-article")
            button.addClass("save")
            button.attr("data-id", item._id)
            newArticle.append(h2).append(h4).append(button)
            articles.append(newArticle)
        }
        else{
            button.text("Delete Article")
            button.attr("id", "delete-article")
            button.attr("data-id", item._id)
            newArticle.append(h2).append(h4).append(button)
            saved.append(newArticle)
        }
    });
}

function displaySavedArticles(data){
    console.log("in saved art"+data)
    var articles = $("#articles")
    var saved = $("#saved-articles")
    showandhide(saved, articles)
    saved.html('')
    data.map(function(item, i) {
        if(item.saved){
            var newArticle=$("<article>")
            var h2=$("<h2>")
            var h4 =$("<h4>")
            var a=$("<a>")
            var button = $("<button>")
            a.text(item.title)
            a.attr("href", item.link)
            h2.append(a)
            h4.text(item.excerpt)
            button.text("Delete Article")
            button.attr("id", "delete-article")
            button.attr("data-id", item._id)
            newArticle.append(h2).append(h4).append(button)
            saved.append(newArticle)
        }
    });    
}