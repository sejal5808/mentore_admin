const mongoose = require('mongoose');

const curdSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    Mobile_no: {
        type: Number,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
}, { timestamps: true });

const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    image: {
        type: Array,
        require: true
    },
    SubTitle: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    user_id:{
        type:mongoose.ObjectId,
        require:false
    },
    is_like:{
        type:Array,
        require:false
    },
    like:{
        type:Boolean,
        require:false
    }

}, { timestamps: true });

const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        require: false
    },
    password: {
        type: String,
        require: false
    },
    phone: {
        type: Number,
        require: false
    },
    email: {
        type: String,
        require: false
    },
    gender:{
        type:String,
        require:false
    },
    image:{
        type:String,
        require:false
    },
}, { timestamps: true });

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    roll: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    expertise: {
        type: Array,
        require: true
    },

    status:{ type: Boolean, default: true }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        require: false
    },
    image: {
        type: String,
        require: false
    },
    description: {
        type: String,
        require: false
    },
    date: {
        type: String,
        require: false
    },
    time: {
        type: String,
        require: false
    },
    day: {
        type: String,
        require: false
    }
}, { timestamps: true });

const contact = new mongoose.Schema({
    name:{
        type:String,
        require:false
    },
    email:{
        type:String,
        require:true
    },
    subject:{
        type:String,
        require:false
    },
    message:{
        type:String,
        require:false
    }
},{ timestamps: true });

module.exports = {
    Curd: mongoose.model('Curd', curdSchema),
    Course: mongoose.model('Course', coursesSchema),
    login: mongoose.model('login', loginSchema),
    Trainer: mongoose.model('Trainer', trainerSchema),
    Event: mongoose.model('Event', eventSchema),
    Conatct:mongoose.model('Conatct',contact)
};
