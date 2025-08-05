import express from 'express';

const router = express.Router();

const adminUser = {
  email: 'admin@example.com',
  password: '123',
};

//router.post('/login', (req, res) => {
 // const { email, password } = req.body;

 // if (email === adminUser.email && password === adminUser.password) {
 //   return res.json({ success: true });
 // } else {
 //   return res.status(401).json({ success: false, message: 'Invalid credentials' });
 // }
//});
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', email, password); // 👈 ADD THIS

  if (email === adminUser.email && password === adminUser.password) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

export default router;


