import express from 'express'
const router = express.Router()
import {Getuser,ChangstatusUser,ChangroleUser,Addusercart,Getusercart,emtyremovecart,AdduserAddress,Saveuserorder,Getuserorder} from '../controllers/user'
import {Authcheck,Admincheck} from '../middenware/auth-admin-check'

router.get('/users',Authcheck,Admincheck,Getuser)
router.post('/userchangstatus', Authcheck,Admincheck,ChangstatusUser)
router.post('/changroleuser', Authcheck,Admincheck,ChangroleUser)
router.post('/addusercart', Authcheck,Addusercart)
router.get('/getusercart', Authcheck,Admincheck,Getusercart)
router.delete('/emtyremovecart', Authcheck,Admincheck,emtyremovecart)
router.post('/adduseraddress', Authcheck,Admincheck,AdduserAddress)
router.post('/saveuserorder', Authcheck,Admincheck,Saveuserorder)
router.get('/getuserorder', Authcheck,Admincheck,Getuserorder)


export default router