const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note")
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the notes Using : GET "/api/auth/getuser". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

// ROUTE 2: Add a new notes Using : Post "/api/auth/addNotes". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // If there are errors , Return bad request ans the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await notes.save();
        res.json(savedNote);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }


})
// ROUTE 3: Update a existing Note : Post "/api/auth/addNotes". Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        // Find the note to be Updated and updated it
        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found");
        }
        if (note.user.toString() != req.user.id) {
            res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }

})
// ROUTE 4: Delete a existing Note : Post "/api/auth/deletenote". Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Find the note to be Updated and updated it
        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found");
        }

        // Allow deletion only to owner
        if (note.user.toString() != req.user.id) {
            res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note Has Been deleted", note: note })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }

})

module.exports = router;