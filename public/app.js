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
    $.post("/scrape", function(data){
            if(data.length>0){
                displayArticles(data);
            }
            else{
                console.log("no new article")
            }
            
        })
})

$("#articles").on("click", "#save-article", function(){
    var id = $(this).attr("data-id")
    $(this).attr("hidden", true)
    $.post("/save/"+id)
        .done(function(err, data){
            console.log(data)
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
    articles.empty()
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
    console.log(data)
    var saved = $("#saved-articles")
    saved.empty()
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