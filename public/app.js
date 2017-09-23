$(document).ready(function(){
    $.getJSON("/articles", function(data){
        displayArticles(data)
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
        alert(data)
        $.getJSON("/articles", function(data){
            displayArticles(data)
        })
    })
})

$("#articles").on("click", "#save-article", function(){
    var id = $(this).attr("data-id")
    $.post("/save/"+id)
    .done(function(data){
        displayArticles(data);
    })
})

$("#saved-articles").on("click", "#delete-article", function(){
    var id = $(this).attr("data-id")
    console.log(id, "delete")
    $.post("/delete/"+id)
        .done(function(data){
            displaySavedArticles(data);
        })
})

$("#saved").on("click", function(){
    $.getJSON("/saved", function(data){
        $("#articles").attr("hidden",true)
        $("#saved-articles").attr("hidden",false)
        displaySavedArticles(data);
    })
})

$("#home").on("click", function(){
    $("#saved-articles").attr("hidden",true)
    $("#articles").attr("hidden",false)
})

function displayArticles(data){
    console.log(data)
    var articles = $("#articles")
    articles.html('')
    data.map(function(item, i) {
        if(!item.saved){
            var newArticle=$("<article>")
            var h2=$("<h2>")
            var h4 =$("<h4>")
            var a=$("<a>")
            var button = $("<button>")
            a.text(item.title)
            a.attr("href", item.link)
            h2.append(a)
            h4.text(item.excerpt)
            button.text("Save Article")
            button.attr("id", "save-article")
            button.addClass("save")
            button.attr("data-id", item._id)
            newArticle.append(h2).append(h4).append(button)
            articles.append(newArticle)
        }
    });
}

function displaySavedArticles(data){
    console.log("in saved art"+data)
    var saved = $("#saved-articles")
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