const express = require("express");
const router = express.Router();
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminAuth')


router.get('/login',adminAuth.cacheClearing,adminAuth.isLogin,adminController.loadLogin)

router.post('/login',adminAuth.cacheClearing,adminController.login)

router.get('/dashboard',adminAuth.checkSession,adminController.loadDashboard)

router.post('/edit-user',adminAuth.checkSession,adminController.editUser)

router.post('/delete-user',adminAuth.checkSession,adminController.deleteUser)

router.post('/add-user',adminAuth.checkSession,adminController.addUser)

router.get('/logout',adminAuth.cacheClearing,adminAuth.checkSession,adminController.logout)

router.post('/searchUser',adminAuth.checkSession,adminController.searchUser)

router.get('*',adminAuth.cacheClearing,adminController.wrongURL)

module.exports = router;    