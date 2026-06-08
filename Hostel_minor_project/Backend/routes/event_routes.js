const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const User = require('../models/user');
const fetchuser = require('../middleware/fetchuser');
const fetchadmin = require('../middleware/fetchadmin');

// Route 1: Get all events GET '/api/events/getevents' (requires auth)
router.get('/getevents', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json({ events, response: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", response: false });
    }
});

// Route 2: Register student for event POST '/api/events/registerevent' (requires student auth)
router.post('/registerevent', fetchuser, async (req, res) => {
    try {
        const { eventId } = req.body;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found", response: false });
        }

        if (event.participants.includes(req.user)) {
            return res.status(400).json({ message: "Already registered for this event", response: false });
        }

        event.participants.push(req.user);
        event.participationCount = event.participants.length;
        await event.save();

        res.json({ message: "Successfully registered for event!", event, response: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", response: false });
    }
});

// Route 3: Fetch student participation history GET '/api/events/participation' (requires student auth)
router.get('/participation', fetchuser, async (req, res) => {
    try {
        const events = await Event.find({ participants: req.user }).sort({ date: -1 });
        res.json({ events, response: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", response: false });
    }
});

// Route 4: Add new event POST '/api/events/addevent' (requires admin auth)
router.post('/addevent', fetchadmin, async (req, res) => {
    try {
        const { name, date, venue, description, status, liveUpdates, winners, achievements, galleryPhotos } = req.body;
        
        const newEvent = new Event({
            name,
            date,
            venue,
            description,
            status: status || 'Upcoming',
            liveUpdates: liveUpdates || '',
            winners: winners || '',
            achievements: achievements || '',
            galleryPhotos: galleryPhotos || [],
            participants: []
        });

        const savedEvent = await newEvent.save();
        res.json({ message: "Event created successfully", event: savedEvent, response: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", response: false });
    }
});

module.exports = router;
