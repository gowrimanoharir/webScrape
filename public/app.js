$("#scrape").on("click", function(){
    $.getJSON("/scrape", function(data){
        displayArticles(data);
    })
})

$("#articles").on("click", "#save-article", function(){
    var article = $(this).closest("article")
    var saveData = {
        title: article.find("a").text(),
        link: article.find("a").attr("href"),
        excerpt: article.find("h4").text()
    }

    $(this).attr("disabled", true)

    $.post("/save", saveData, function(data){
        console.log(data)

    })
})

function displayArticles(data){
    console.log(data)
    var articles = $("#articles")
    articles.empty()
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
        button.text("Save Article")
        button.attr("id", "save-article")
        button.addClass("save")
        button.attr("data-id", i)
        newArticle.append(h2).append(h4).append(button)
        articles.append(newArticle)
    });
}