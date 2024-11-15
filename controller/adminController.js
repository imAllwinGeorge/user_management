    const adminModel = require('../model/adminModel')
    const bcrypt = require('bcrypt')
    const userModel = require('../model/userModel')
    const mongoose = require('mongoose')



const loadLogin = async (req,res)=>{
    res.render('admin/login')
}

const login = async (req,res)=>{

    const {email,password} = req.body


    try {

        const admin = await adminModel.findOne({email})

        if(!admin) return res.render('admin/login',{message:"Invalid Credential"})
        
        const isMatch = await bcrypt.compare(password,admin.password)

        if(!isMatch) return res.render('admin/login',{message:"Wrong Password"})
        
        req.session.admin = true

        res.redirect('/admin/dashboard')

    } catch (error) {
        res.send(error)
    }
}

const loadDashboard = async (req,res)=>{

    const admin = req.session.admin

    if(!admin) return res.render('admin/login')

    const users = await userModel.find({})

    res.render('admin/dashboard',{users})
}

const editUser = async (req,res)=>{
       
    try {
        
        const {id,email,password} = req.body

        const existUser = await userModel.findOne({email})

        if(existUser) return res.redirect('/admin/dashboard?userExists=true')

        console.log(id)
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.findOneAndUpdate({_id:id},{email,password:hashedPassword})
        
        res.redirect('/admin/dashboard')
      
    } catch (error) {
        console.log(error);
        
    }
}

const deleteUser = async(req,res)=>{
    
    try {
        const {id} = req.body
        
        const user = await userModel.findOneAndDelete({_id:id})

        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error)
    }
}

const addUser = async (req,res)=>{
    try {
        
        const {email,password} = req.body

        const existUser = await userModel.findOne({email})

        if(existUser) return res.redirect('/admin/dashboard?userExists=true')
        
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await userModel({
            email,
            password:hashedPassword
        })

        await newUser.save()

        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error)
    }
}

const searchUser = async (req,res)=>{

    try {
        
        const {email} = req.body
        
        const users = await userModel.find({
            email: { $regex: email, $options: 'i' }
          });
        
        if(!users) return res.redirect('/admin/dashboard')
        console.log("it reaches here")

        res.render('admin/dashboard',{users})

    } catch (error) {
        console.log(error)
    }
}

const logout= async (req,res)=>{
    
    req.session.admin = null

    res.redirect('/admin/login')
}

const wrongURL = (req,res)=>{
    res.status(404).send('page not found')
}

module.exports = {
    loadLogin,
    login,
    loadDashboard,
    editUser,
    deleteUser,
    addUser,
    logout,
    searchUser,
    wrongURL
}