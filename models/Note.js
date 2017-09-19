var mongoose = require("mongoose")

var Schema = mongoose.Schema

var NoteSchema = new Schema({
    comments: {
        type: String
    },
})

var Note = mongoose.model("Note", NoteSchema)

module.exports = Note