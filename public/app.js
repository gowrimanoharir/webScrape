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

$("#saved-articles").on("click", "#add-note", function(){
    var id = $(this).attr("data-id")
    $("#note-modal").modal("show")
    $("#save-note").attr("data-id", id)
    $.getJSON("/notes/"+id, function(data){
        console.log("in get notes"+data)
        if(data[0].note.length>1){
            console.log("add note", data[0].note)
            displayNotes(data[0].note)
        }
        
    })
})

$("#save-note").on("click", function(){
    var id = $(this).attr("data-id")
    var notes = {
        comments: $("#note-text").val()
    }
    $("#save-note").attr("data-id", "")
    $("#note-modal").modal("hide")
    $.post("/addNote/"+id, notes)
    .done(function(data){
        console.log(data)
    })    
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
            var addNote = $("<button>")
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

            addNote.text("Add Note")
            addNote.attr("id", "add-note")
            addNote.attr("data-id", item._id)
            newArticle.append(h2).append(h4).append(button).append(addNote)
            saved.append(newArticle)
        }
    });
}

function displayNotes(data){
    var notesDisplay = $("#notes-display")
    data.map(function(item, i){
        var note = $("<li>")
        note.addClass("list-group-item")
        note.text(item.comments)
        notesDisplay.append(note)
    })
}

// function displaySavedArticles(data){
//     console.log("in saved art"+data)
//     var articles = $("#articles")
//     var saved = $("#saved-articles")
//     showandhide(saved, articles)
//     saved.html('')
//     data.map(function(item, i) {
//         if(item.saved){
//             var newArticle=$("<article>")
//             var h2=$("<h2>")
//             var h4 =$("<h4>")
//             var a=$("<a>")
//             var button = $("<button>")
//             a.text(item.title)
//             a.attr("href", item.link)
//             h2.append(a)
//             h4.text(item.excerpt)
//             button.text("Delete Article")
//             button.attr("id", "delete-article")
//             button.attr("data-id", item._id)
//             newArticle.append(h2).append(h4).append(button)
//             saved.append(newArticle)
//         }
//     });    
// }