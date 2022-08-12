const express = require('express')
const router = express.Router();
const Notes = require('../Models/Notes') 
const fetchuser = require('../midleware/fetchuser')

const { body, validationResult } = require("express-validator");

//route 1
router.get('/fetchallnotes', fetchuser, async(req,res)=>{
    const notes = await Notes.find({user:req.user.id})
res.json({'notes':notes});
})


//route 2
router.post('/addnotes', fetchuser,[
    body('title',"Title must be more than 3 char").isLength({min : 3}),
    body('description',"description must be more than 5 char").isLength({min :5})
    
    ],
    
    async(req,res)=>{
    
        const {title,description,tag} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        try{
            const note = new Notes({
                title,description,tag,user:req.user.id
            })
            const savednotes = await note.save();
            res.json({'note':savednotes});
        } catch(error){
            console.log(error);
        } 
    })


    //route 3
    router.put('/updatenotes/:id', fetchuser,[
        body('title',"Title must be more than 3 char").isLength({min : 3}),
        body('description',"description must be more than 5 char").isLength({min :5})
        
        ],
        
        async(req,res)=>{
        
            const {title,description,tag} = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
        
            try{ 
    
                const newNote = {};
    
                if(title){newNote.title = title}
                if(description){newNote.description = description}
                if(tag){newNote.tag = tag}
    
                let note = await Notes.findById(req.params.id);
                if(!note){ return res.status(404).send('Not Found')}
                if(note.user.toString() !== req.user.id){ return res.status(401).send('Not Allowed')}
    
                const updatednotes = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new:true});
                res.json({'note':updatednotes});
            } catch(error){
        
                console.log(error);
            } 
        })


 //route 4
 router.delete('/deletenotes/:id', fetchuser, 
    async(req,res)=>{ 
        try{  
            let note = await Notes.findById(req.params.id);
            if(!note){ return res.status(404).send('Not Found')}
            if(note.user.toString() !== req.user.id){ return res.status(401).send('Not Allowed')}

            const deletenotes = await Notes.findByIdAndDelete(req.params.id);
            res.json({'note':deletenotes, 'status':'Deleted'});
        } catch(error){
    
            console.log(error);
        } 
    })
     
module.exports = router