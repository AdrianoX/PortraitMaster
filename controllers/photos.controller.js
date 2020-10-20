const Photo = require('../models/photo.model');
const Voter = require('../models/Voter.model');
const requestIp = require('request-ip');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    if(title && author && email && file) { // if fields are not empty...

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split('.').slice(-1)[0]; 


      if(title.length <= 25 && author.length <= 50 && (fileExt == 'gif' || fileExt == 'jpg' || fileExt == 'png')){

        let emailTest = RegExp.prototype.test.bind(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        let html = RegExp.prototype.test.bind(/[^a-zA-Z]*$/);


        if(html(title) === false && emailTest(email) === true){

          const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });

          await newPhoto.save(); // ...save new photo in DB
          res.json(newPhoto); // <_--- CL ??
      }}
    } else {
      throw new Error('Wrong input!');
    }

  } catch(err) {
    res.status(500).json(err);
  }

};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch(err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {

  try {
    const userIp = requestIp.getClientIp(req);
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    const existingVote = await Voter.findOne({ user: userIp });

    if(!photoToUpdate) res.status(404).json({ message: 'Not found' });

    // record for a given IP adress doeasn't exist...
    else if(!existingVote){

      const newVote = new Voter({ user: userIp, votes: [req.params.id] });
      await newVote.save();

      photoToUpdate.votes++;
      await photoToUpdate.save();

      res.json(newVote);
    }
    // record for a given IP adress exist...
    else {
      if(existingVote.votes.includes(photoToUpdate._id)) {
        res.status(500).send('Only one voice per photo !');
      } else {
        existingVote.votes.push(photoToUpdate._id)
        await existingVote.save();

        photoToUpdate.votes++;
        await photoToUpdate.save();
        res.send({ message: 'OK' });
      }

    }
  } catch(err) {
    res.status(500).json(err);
  }

};