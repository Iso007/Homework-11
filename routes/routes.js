const fs = require(`fs`);
const path = require(`path`);

module.exports = app => {

    //setup notes variable
    fs.readFile(`db/db.json`,`utf8`, (err, data) => {
        if (err) throw err;
        var notes = JSON.parse(data);

        //API Routes |==================================================|

        //api setup
        app.get(`/api/notes`, function(req, res){
            res.json(notes);
        });

        app.post(`/api/notes`, function(req, res){
            //receive new note, add it to db.json
            let newNote = req.body;
            notes.push(newNote);
            updateDb();
            return console.log(`Added new note: `+newNote.title);
        });

        //retrive note by specific id
        app.get(`/api/notes/:id`, function(req, res){
            notes.splice(req.params.id, 1);
            updateDb();
            console.log(`Deleted note with id `+req.params.id);
        });

        //View Routes |================================================|

        //Display notes.htmll when notes is accessed
        app.get(`*`, function(req, res){
            res.sendFile(path.join(__dirname, `../public/index.html`));
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