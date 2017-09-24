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
        $("#articlesadded").text(data)
        $("#alert-modal").modal("show")
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
    $("#note-text").css("border-color", "rgb(169,169,169)")
    var id = $(this).attr("data-id")
    $("#note-modal").modal("show")
    $("#save-note").attr("data-id", id)
    $.getJSON("/notes/"+id, function(data){
        console.log("in get notes"+data)
        displayNotes(data, id)
       
    })

})

$("#save-note").on("click", function(){
    var id = $(this).attr("data-id")
    var notes = {
        comments: $("#note-text").val().trim()
    }
    if(notes.comments.length>0){
        $("#note-text").val("")
        $("#save-note").removeAttr("data-id")
        $("#note-modal").modal("hide")
        $.post("/addNote/"+id, notes)
    } 
    else{
        $("#note-text").css("border-color", "red")
    }  
})

$("#notes-display").on("click", "#delete-note", function(){
    var id = $(this).attr("data-id")
    var aid = $(this).attr("data-aid")
    console.log(id, "deleteNote")
    $.post("/deleteNote/"+id+"/"+aid)
        .done(function(data){
            displayNotes(data, aid);
        })
})



function displayArticles(data){
    console.log(data)
    //articles.html('')
    data.map(function(item, i) {
            var newArticle=$("<article>")
            newArticle.addClass("panel panel-primary")
            var pheader=$("<div>")
            pheader.addClass("panel-heading")
            var pbody =$("<div>")
            pbody.addClass("panel-body")
            var h2=$("<h2>")
            var a=$("<a>")
            a.addClass("article-link")
            a.attr("target", "_blank")
            var button = $("<button>")
            var addNote = $("<button>")
            a.text(item.title)
            a.attr("href", item.link)
            pbody.text(item.excerpt)
        if(!item.saved){            
            button.text("Save Article")
            button.attr("id", "save-article")
            button.addClass("btn save")
            button.attr("data-id", item._id)
            h2.append(a).append(button)
            pheader.append(h2)
            newArticle.append(pheader).append(pbody)
            articles.append(newArticle)
        }
        else{
            button.text("Delete Article")
            button.attr("id", "delete-article")
            button.attr("data-id", item._id)
            button.addClass("btn")
            addNote.text("Add Note")
            addNote.attr("id", "add-note")
            addNote.attr("data-id", item._id)
            addNote.addClass("btn")
            h2.append(a).append(button).append(addNote)
            pheader.append(h2)
            newArticle.append(pheader).append(pbody)
            saved.append(newArticle)
        }
    });
}

function displayNotes(data, id){
    var notesDisplay = $("#notes-display")
    $("#notes-display").html("")
    data.map(function(item, i){
        var note = $("<li>")
        var del = $("<button>")
        note.addClass("list-group-item")
        note.text(item.comments)
        del.addClass("btn btn-danger")
        del.text("x")
        del.attr("id", "delete-note")
        del.attr("data-id", item._id)
        del.attr("data-aid", id)
        note.append(del)
        notesDisplay.append(note)
    })
}

