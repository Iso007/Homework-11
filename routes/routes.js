const fs = require(`fs`);
const path = require(`path`);

module.exports = app => {

    //setup notes variable
    fs.readFile("db/db.json","utf8", (err, data) => {
        if (err) throw err;
        var notes = JSON.parse(data);

        //API Routes |==================================================|

        // /api/notes setup, get route
        app.get("/api/notes", function(req, res){
            //Reads db.json files and return all saved notes as JSON
            res.json(notes);
        });

        // /api/notes setup, post route
        app.post("/api/notes", function(req, res){
            //receive new note, add it to db.json
            let newNote = req.body;
            notes.push(newNote);
            updateDb();
            return console.log("Added new note: "+newNote.title);
        });

        //retrive note by specific id
        app.get("/api/notes/:id", function(req, res){
            //display json for the notes array indices of the provided id
            res.json(notes[req.params.id]);
        });

        //deletes note by specific id
        app.delete("/api/notes/:id", function(req, res){
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id "+req.params.id);
        });

        //View Routes |================================================|

        //Display notes.htmll when notes is accessed
        app.get(`/notes`, function(req, res){
            res.sendFile(path.join(__dirname, `../public/notes.html`));
        });

        //Display index.html when all other routes are accessed
        app.get(`*`, function(req,res){
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        //updates the json file whenever a note is added or deleted
        function updateDb(){
            fs.writeFile(`db/db.json`, JSON.stringify(notes,'\t'),err =>{
                if (err) throw err;
                return true;
            });
        }
    });

}