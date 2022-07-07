/* eslint-disable consistent-return */
/* eslint-disable max-len */
const router = require('express').Router();
const User = require('../models/users');
const logger = require('../logger/index');

router.post('/suggestions', async (req, res) => {
  try {
    req.body.name = req.body.name.trim();
    if (req.body.name === '') { return res.status(400).json({ message: '' }); }
    let str = `^${req.body.name}`;
    let regexfirst = new RegExp(str, 'i');
    let str1 = `^${req.body.name}$`;
    let regexlast = new RegExp(str1, 'i');
    if (req.body.name.indexOf(' ') !== -1) {
      const namesplit = req.body.name.split(' ');
      str = `^${namesplit[0]}$`;
      str1 = `^${namesplit[1]}$`;
      regexfirst = new RegExp(str, 'i');
      regexlast = new RegExp(str1, 'i');
      const result = await User.find({ firstname: regexfirst, lastname: regexlast });
      res.status(201).json({ message: result });
    } else {
      const result = await User.find({ $or: [{ firstname: regexfirst }, { lastname: regexlast }] });
      res.status(201).json({ message: result });
    }
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: 'Something went wrong' });
  }
});
// can also use this api in which i have comboned firstname and lastname to fullname in query ,check it according to requirement as it works on different regex logic
// app.post("/api/search/suggestions", async (req,res)=>{
//   try{
//     req.body.name=req.body.name.trim();
//     if(req.body.name=="")
//     return res.status(400).json({message:""});

//     let str1=`.*${req.body.name}.*`;
//     let regex=new RegExp(str1,"i");
//     const result=await User.aggregate([{$addFields:{newField:{$concat:["$firstname"," ","$lastname"]}}},
//     {$match:{newField:regex}} ]);
//     res.status(201).json({message:result});
// }catch(err){
// res.status(400).json({message:"Something went wrong"})
// }
// });
module.exports = router;
