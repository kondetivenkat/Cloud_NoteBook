const express =require('express')
const router = express.Router();
const {validationResult, body } = require('express-validator');
var fetchUser  = require('../middleware/fetchuser');
const Notes =require('../models/Notes');

//fetch all notes
router.get('/getnotes',fetchUser,async(req,res)=>{
    const notes = await Notes.find({user:req.user.id});
    res.json(notes);
})

// add notes
router.post('/addnotes',fetchUser,[
  body('title','enter title').isLength({min:3}),
  body('description','description is atleast 5 length').isLength({min:5}),
],async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return  res.status(400).json({error:errors.array()})
        }
        const note = new Notes({
            title,description,tag,user:req.user.id
        })
        const savenote = await note.save();
        res.json(savenote)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

//update notes
router.put('/updatenote/:id',fetchUser,async (req,res)=>{
    const {title,description,tag}=req.body;
    try {
        const newNote ={};
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}
    
        let newnote = await Notes.findById(req.params.id)
        if(!newnote){
            return res.status(404).send("Not found")
        }
        if(newnote.user.toString() !== req.user.id){
            return res.status(401).send("not allowed")
        }
         newnote = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json({newnote}); 
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})
router.delete('/deletenote/:id',fetchUser,async(req,res)=>{
    try {
        let note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not found")
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"success":"note has been deleted",note:note})
    } catch ({error}) {
        res.status(500).json({error:error.message})
    }
})
module.exports=router;