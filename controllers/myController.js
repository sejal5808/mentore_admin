const { Curd, Course, login, Trainer, Event, Conatct } = require('../models/curdModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// const crypto = require('crypto');

// function generateRandomString(length) {
//   return crypto.randomBytes(Math.ceil(length / 2))
//     .toString('hex')
//     .slice(0, length);
// }

// Generate a random string of length 32
// const secretKey = generateRandomString(32);
// console.log(secretKey);

// exports.getAll = async (req, res) => {
//   try {
//     const curds = await Curd.find();
//     res.json(curds);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.create = async (req, res) => {
//   try {

//     const curd = new Curd({
//       name: req.body.name,
//       email: req.body.email,
//       firstName: req.body.firstName,
//       Mobile_no: req.body.Mobile_no,
//       lastName: req.body.lastName,
//       image: req.body.image
//     });

//     const newCurd = await curd.save();
//     res.status(201).json(newCurd);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Controller logic for user register
exports.register = async (req, res) => {
  try {
    const existingUser = await login.findOne({ email: req.body.email });

    if (existingUser) {
      return res.json({
        status: false,
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    let data = await login.create(req.body);

    if (data) {
      res.status(201).json({
        status: true,
        message: 'User registered successfully',
      });
    }
  } catch (error) {
    console.log("req.body", error);

    res.status(500).json({ status: false, error: 'Internal server error' });
  }
};



// Controller logic for userlogin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await login.findOne({ email });

    if (!user) {
      return res.json({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.json({ message: 'Invalid  password' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: true,
      message: 'User Login successfully',
      data: user,
      token: token
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: 'Internal server error'
    });
  }
};
exports.user = async (req, res) => {
  try {
    const alluser = await login.find();
    res.json({
      user: alluser
    })
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller logic for getall Course
exports.getAllCourses = async (req, res) => {
  try {
    const allcourses = await Course.find();
    const alltrainer = await Trainer.find();
    res.json({
      courses: allcourses,
      trainer: alltrainer,
      status: 'success'

    })
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller logic for Add Course
exports.addCourses = async (req, res) => {
  // const requestBody = req.body;
  // const bodySizeInBytes = Buffer.byteLength(JSON.stringify(requestBody));

  // console.log('Request body size:', bodySizeInBytes, 'bytes');
  try {
    // req.body = JSON.parse(req.body.data);
    const existingCourse = await Course.findOne({ name: req.body.name });
    if (existingCourse) {
      res.json({ message: 'Course with this name already exists' });
    }
    const curd = new Course({
      name: req.body.name,
      price: req.body.price,
      SubTitle: req.body.SubTitle,
      description: req.body.description,
      image: req.body.image
    });
    const newCurd = await curd.save();
    res.status(200).json({
      status: 'success',
      message: 'Course added successfully',
      data: newCurd
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller logic for update Course
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const oldData = await Course.findById(id);

    if (!oldData) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Delete old images if they exist
    if (oldData.image && oldData.image.length > 0) {
      const removedImages = oldData.image.filter(oldImage => !newData.image.includes(oldImage));
      for (const removedImage of removedImages) {
        const imagePath = path.join('uploads/Course', removedImage);
        try {
          await fs.promises.unlink(imagePath);
          console.log(`Deleted removed image file: ${removedImage}`);
        } catch (error) {
          console.error(`Error deleting removed image file ${removedImage}:`, error);
        }
      }
    }


    // Update the product data
    const updatedCourse = await Course.findByIdAndUpdate(id, newData, { new: true });

    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error("Error occurred while updating product:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller logic for getall Trainer
exports.getAllTrainer = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllAcriveTrainer = async (req, res) => {
  try {
    const ActiveTrainer = await Trainer.find({ status: true });
    res.json(ActiveTrainer);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller logic for Add Trainer
exports.addTrainer = async (req, res) => {
  try {
    req.body = JSON.parse(req.body.data);
    const existTrainer = await Trainer.findOne({ phone: req.body.phone });
    if (existTrainer) {
      res.json({ message: 'Trainer already available' });
    }
    const trainer = new Trainer({
      name: req.body.name,
      roll: req.body.roll,
      image: req.file.filename,
      description: req.body.description,
      gender: req.body.gender,
      phone: req.body.phone,
      expertise: req.body.expertise,
    });
    const newTrainer = await trainer.save();
    res.status(200).json({
      status: 'success',
      message: 'Trainer added successfully',
      data: newTrainer
    });
  }
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller logic for edit Trainer
exports.editTrainer = async (req, res) => {
  try {
    req.body = JSON.parse(req.body.data);
    const id = req.body._id;
    const newData = {
      name: req.body.name,
      roll: req.body.roll,
      description: req.body.description,
      gender: req.body.gender,
      phone: req.body.phone,
      expertise: req.body.expertise,
    };

    if (req.file) {
      newData.image = req.file.filename;
    }
    const oldData = await Trainer.findById(id);

    // Delete old images if they exist
    if (oldData.image && oldData.image.length > 0) {
      if (oldData.image != newData.image) {
        const removeimage = oldData.image;
        const imagePath = path.join('uploads/Trainer', removeimage);
        try {
          await fs.promises.unlink(imagePath);
          console.log(`Deleted removed image file: ${removeimage}`);
        } catch (error) {
          console.error(`Error deleting removed image file ${removeimage}:`, error);
        }
      }
    }
    const updatedTrainer = await Trainer.findByIdAndUpdate(id, newData, { new: true });
    if (!updatedTrainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json({
      status: 'success',
      message: 'Trainer updated successfully',
      data: updatedTrainer
    });
  } catch (error) {
    console.error("Error occurred while updating trainer:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller logic for Event GET
exports.getAllEvent = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Controller logic for Event ADD
exports.addEvent = async (req, res) => {
  try {
    const events = new Event(req.body);
    const newEvent = await events.save();
    res.status(200).json({
      status: 'success',
      message: 'Event added successfully',
      data: newEvent
    });
  }
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller logic for Event EDIT
exports.editEvent = async (req, res) => {
  try {
    const id = req.body.id;
    console.log("id", id)
    const newData = req.body;
    const updateData = await Event.findByIdAndUpdate(id, newData, { new: true });
    if (!updateData) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({
      data: updateData,
      status: 'succses',
      message: 'Event updated sussefully'
    })
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller logic for image uploadfs
exports.uploadImages = (req, res) => {
  if (req.files && req.files.length > 0) {
    const filenames = req.files.map(file => file.filename);
    res.json({ filenames });
  } else {
    res.status(400).json({ error: 'No files uploaded' });
  }
};
// Controller logic for delete Course & tariner & event

exports.delete = async (req, res) => {
  try {
    const { TableName, id } = req.body;
    let Model;

    switch (TableName) {
      case 'Trainer':
        Model = Trainer;
        break;
      case 'Course':
        Model = Course;
        break;
      case 'Event':
        Model = Event;
        break;
      default:
        return res.status(400).json({ message: 'Invalid TableName' });
    }

    const removed = await Model.findByIdAndDelete(id);

    if (removed == null) {
      return res.status(404).json({ message: `${TableName} not found` });
    }

    await removed.deleteOne();

    res.json({
      status: true,
      message: `${TableName} Deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.DactiveTrainer = async (req, res) => {
  try {
    const TrinerId = req.body.id;
    const trainers = await Trainer.findByIdAndUpdate(TrinerId, { status: false }, { new: true });
    res.json({ msg: 'Trainer Deactive successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.ActiveTrainer = async (req, res) => {
  try {
    const TrinerId = req.body.id;
    const trainers = await Trainer.findByIdAndUpdate(TrinerId, { status: true }, { new: true });
    res.json({ msg: 'Trainer Active successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.like = async (req, res) => {
  try {
    const courseId = req.body.id;
    const userId = req.body.is_like;
    ``
    const existingCourse = await Course.findById(courseId);


    if (!existingCourse) {
      return res.status(404).json({ status: false, message: 'Course not found' });
    }

    const isLiked = existingCourse.is_like.includes(userId)

    if (isLiked) {
      existingCourse.is_like = existingCourse.is_like.filter(id => id !== userId);
      existingCourse.like = req.body.like


    }
    else {
      existingCourse.is_like.push(userId);
      existingCourse.like = req.body.like;
    }

    const updatedCourse = await existingCourse.save();

    res.status(200).json({
      status: true,
      message: isLiked ? 'Course unliked successfully' : 'Course liked successfully',
      data: updatedCourse
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.contactus = async (req, res) => {
  try {
    const contactus = new Conatct(req.body);
    const newEvent = await contactus.save();
    res.status(200).json({
      status: 'success',
      message: 'We Will Touch You Soon',
    });
  }
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const id = req.body.id;
    // const newData = req.body;

    let body = {
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      gender: req.body.gender,
      image: req.body.image
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      body.password = hashedPassword;
    }
    const updateData = await login.findByIdAndUpdate(id, body, { new: true });

    if (!updateData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      data: updateData,
      status: 'success',
      message: 'Your profile  updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.usermsg = async (req, res) => {
  // Extract the message from the request body
  const message = req.body;

  // Logic to send the private message
  // This could involve sending the message to a specific user or storing it in a database

  // For demonstration purposes, let's just log the message
  // console.log('Received private message:', message);

  // Respond with a success message
  res.status(200).json({ message: 'Message sent successfully' });
};