const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }else if (user.status==false) {
        return res.status(403).json({ message: 'Access denied' });
      }
      else if (user.verificationCode!=null) {
        return res.status(401).json({ message: 'Please verify your account' });
      } else {
        if(user.expirePayementDate>new Date())
        {
          user.paid=true;
        }
        else
        {
          user.paid=false;
        }
        const token = jwt.sign({ email: user.email,username:`${user.firstName} ${user.lastName}`, role: user.role, id:user.id,expirePaid:user.expirePayementDate,level: user.level, address:user.address, phone:user.phone }, "Promotunisie-secret-key", { expiresIn: '1h' });
        res.json({ token });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/signup',async (req, res) => {
    try {
        const { firstName, lastName, email, password ,address,phone} = req.body;
        if (!firstName || !lastName || !email || !password || typeof firstName !== 'string' ||  typeof lastName !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof address !== 'string' ) {
            return res.status(400).json({ success: false, error: 'Prénom, nom, email et mot de passe requis' });
        }
        
         const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Cet email est déjà utilisé' });
        }
       
       
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password: hashedPassword,
            address: address,
            phone: phone,           
        });

       
        await user.save();

    
        return res.status(201).json({success: true, message: 'Utilisateur inscrit avec succès'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, error: "Erreur lors de l'ajout de l'utilisateur"});
    }
  })

module.exports = router ;