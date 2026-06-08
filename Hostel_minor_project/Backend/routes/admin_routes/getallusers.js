const express = require('express');
const User = require('../../models/user');
const Room = require('../../models/room')
const Admin = require('../../models/admins');
const Complain = require('../../models/complains_model');
const Token = require("../../models/stoken");
const Attend = require('../../models/attend');
const router = express.Router()
const fetchadmin = require('../../middleware/fetchadmin')

router.get('/getallusers', fetchadmin,  async (req, res) => {
    let userId = req.user;
    const admin = await Admin.findById(userId)
    if(!admin || admin.role!='admin'){
        return res.status(401).json({message:"Access denied",response:false})
    }else{
        const rooms=await Room.find()
        rooms.sort((a, b) => a.room_no - b.room_no);
        const data=[]
        for(let i=0;i<rooms.length;i++){
            let student = await User.findById(rooms[i].user)
         
            data.push({room_no:rooms[i].room_no,name:rooms[i].name,email:student ? student.email : 'N/A'})
        }
        
        
        // const users=await User.find().select("-password")
        // console.log(users)
        res.json({response:true,data:data})
    }

  })

router.get('/allcomplains', fetchadmin,  async (req, res) => {
    let userId = req.user;
    const admin = await Admin.findById(userId)
    if(admin.role!='admin'){
        return res.status(401).json({message:"Access denied",response:false})
    }else{
        try {
            const allcomps = await Complain.find({status:"Pending"})
            res.json({allcomps:allcomps,complains_length:allcomps.length,response:true})
        } catch (error) {
          console.log(error)
            res.status(500).json({ message:'server error',response:false})
        }
    }

  })
router.get('/getallpasses', fetchadmin,  async (req, res) => {
  
        try {
            const allpasses = await Token.find()
            
            res.json({allpasses:allpasses,allpasses_length:allpasses.length,response:true})
        } catch (error) {
          console.log(error)
            res.status(500).json({ message:'server error',response:false})
        }
    

  })

// Route 4: Fetch dashboard real-time statistics GET '/api/ad/stats' (requires admin auth)
router.get('/stats', fetchadmin, async (req, res) => {
    try {
        const userId = req.user;
        const admin = await Admin.findById(userId);
        if (!admin || admin.role !== 'admin') {
            return res.status(401).json({ message: "Access denied", response: false });
        }

        const totalStudents = await User.countDocuments();
        
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const presentToday = await Attend.countDocuments({
            status: "Present",
            date: { $gte: startOfDay, $lt: endOfDay }
        });

        const absentToday = await Attend.countDocuments({
            status: "Absent",
            date: { $gte: startOfDay, $lt: endOfDay }
        });

        const pendingLeaves = await Token.countDocuments({
            status: "Pending"
        });

        const openComplaints = await Complain.countDocuments({
            status: { $ne: "Resolved" }
        });

        const Feedback = require('../../models/feedback');
        const feedbackCount = await Feedback.countDocuments();

        const Event = require('../../models/event');
        const events = await Event.find();
        let eventParticipation = 0;
        events.forEach(e => {
            if (e.participants) eventParticipation += e.participants.length;
        });

        res.json({
            response: true,
            stats: {
                totalStudents,
                presentToday,
                absentToday,
                pendingLeaves,
                openComplaints,
                feedbackCount,
                eventParticipation
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", response: false });
    }
});

module.exports=router