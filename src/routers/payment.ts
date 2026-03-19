import express from "express";
const router = express.Router()
import {Authcheck,Admincheck} from '../middenware/auth-admin-check'
import {Payment} from '../controllers/payment'


router.post('/user/create-checkout-session', Authcheck, Payment)

export default router