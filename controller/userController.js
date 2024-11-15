const userSchema = require('../model/userModel')
const bcrypt = require('bcrypt')
const saltround = 10;

const registerUser = async(req,res)=>{
    
    try {
        const {email,password} = req.body
        const user = await userSchema.findOne({email});
        if(user) {
            console.log("user exist")
            return res.render('user/login',{message:'user already exist'})}

            const hashedPassword = await bcrypt.hash(password,saltround)
        const newUser = new userSchema({
            email,
            password:hashedPassword
        })

        await newUser.save()
        
        res.render('user/login',{message:'User created successfully'})
    } catch (error) {
        
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body

         const user = await userSchema.findOne({email})
         console.log(user)
        if(!user) {
            console.log("user doesn't match")
            return res.render('user/login',{message:'user does not exist'})}
        
        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){ 
            console.log("wrong password")
            return res.render('user/login',{message:'Wrong password'})}
             console.log("successful")
             req.session.user = true
        res.render('user/userHome',{Email:email,Password:password})

    } catch (error) {
        
    }
}

const loadRegister = (req,res)=>{

    res.render('user/register')

}

const loadLogin =   (req,res)=>{

    res.render('user/login')

}

const loadHome = (req,res)=>{
    res.render('user/userHome')
}

const logout = (req,res)=>{
    
    req.session.user = null
    res.redirect('/user/login')
}

const wrongURL = (req,res)=>{
    res.status(404).send("page not found")
}

module.exports = {
    registerUser,
    loadRegister,
    loadLogin,
    login,
    loadHome,
    logout,
    wrongURL
    }