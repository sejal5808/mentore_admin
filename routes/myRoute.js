const express = require('express');
const router = express.Router();
const curdController = require('../controllers/myController');
const {upload,uploads} = require('../services/service');
const {authenticateToken} = require('../middleware/authMiddleware')


router.post('/upload', upload.array('file'), curdController.uploadImages);
// router.get('/get', curdController.getAll);
// router.post('/add', curdController.create);
router.put('/:id', curdController.update);
router.all('/delete', curdController.delete);
router.get('/courses',curdController.getAllCourses);
router.post('/Add-courses',authenticateToken,curdController.addCourses);
router.post('/add-trainer',authenticateToken,uploads.single('image'),curdController.addTrainer);
router.get('/trainer',curdController.getAllTrainer);
router.post('/register',curdController.register);
router.post('/login',curdController.login);
router.all('/edit-Trainer',uploads.single('image'),curdController.editTrainer);
router.get('/all-event',curdController.getAllEvent);
router.post('/add-event',authenticateToken,curdController.addEvent);
router.all('/edit-event',curdController.editEvent);
router.all('/active',curdController.ActiveTrainer);
router.all('/deactive',curdController.DactiveTrainer);
router.get('/activeTrainer',curdController.getAllAcriveTrainer);
router.post('/contact_us',curdController.contactus);
router.post('/update-profile',curdController.updateProfile);
router.post('/like',curdController.like);
router.post('/private',curdController.usermsg);
router.get('/user',curdController.user)





module.exports = router;
