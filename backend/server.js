require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    // Check if user exists
    const existUser = await pool.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );

    if (existUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashpwd = await bcrypt.hash(password, 10);

    // Approval logic
    const approved = role === 'owner' ? 'pending' : 'approved';

    // Insert user
    const newUser = await pool.query(
      `INSERT INTO users (name, phone, password, role, approval_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, phone, role, approval_status`,
      [name, phone, hashpwd, role, approved]
    );

    res.status(201).json({
      message: "User Created Successfully",
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post('/login',async (req,res)=>{
    try{
        const {phone,password,role}=req.body;
        const userExist = await pool.query(
            "select * from users where phone=$1",[phone]
        )
        if (userExist.rows.length==0){
            return res.status(400).json({message : "User doesn't exist"});
        }
        const user = userExist.rows[0];
        if (user.role !== role) {
            return res.status(400).json({ message: "Incorrect role selected" });
        }
        if (!user.is_active){
            return res.status(400).json({message : "User has been blocked"});
        }
        if (user.role == 'owner' && user.approval_status !== 'approved'){
            return res.status(400).json({message : "Owner not approved by admin yet"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch){
            return res.status(400).json({message : "Invalid credentials"});
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
})
app.get('/admin/fetchusers',async (req,res)=>{
  try{
    const users = await pool.query('select name,phone,is_active from users where role=$1',['user']);
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})
app.get('/admin/fetchowners',async (req,res)=>{
  try{
    const users = await pool.query('select id,name,phone,approval_status from users where role=$1 and approval_status=$2',['owner','approved']);
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})
app.put('/admin/owners/:id/updateStatus',async (req,res)=>{
  try{
    const {id} = req.params;
    const {status} = req.body;
    const result = await pool.query(
      `UPDATE users SET approval_status=$1 where id=$2 AND role='owner'`,[status,id]
    )
    res.json({
      message : "Updated success"
    });
  }
  catch(err){
    console.log(err);
  }
})
app.get('/admin/fetchPendingOwners' , async(req,res)=>{
  try{
    const pendingOwners = await pool.query(
      `select id,name,phone,approval_status from users where approval_status='pending'`
    )
    res.json(pendingOwners.rows);
  }
  catch(err){
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
})
app.delete('/admin/owners/:id/deleteOwner',async(req,res)=>{
  try{
    const {id} = req.params;
    const delUser = pool.query(
      `delete from users where id=$1`,[id]
    )
  }
  catch(err){
    console.log(err);
  }
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});