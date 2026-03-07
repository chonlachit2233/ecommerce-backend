import express from 'express'
const router = express.Router()
import {Createproduct, Listproduct, Readproduct, Updateproduct, Removeproduct, Listbyproduct, Searchbyproduct, createimage, removeimages} from '../controllers/product'
import {Authcheck,Admincheck} from '../middenware/auth-admin-check'
router.post('/product',Createproduct)
router.get('/product/:count',Listproduct)
router.get('/products/:id',Readproduct)
router.put('/updateproduct/:id',Updateproduct)
router.delete('/product/:id',Removeproduct)
router.post('/productby',Listbyproduct)
router.post('/search/filters',Searchbyproduct)

router.post('/images',Authcheck, Admincheck, createimage )
router.post('/removeimages',Authcheck, Admincheck, removeimages)

export default router