import { Request, Response } from "express"
import prisma from "../config/prisma"

export const CategoryCreate = async (req: Request, res: Response) => {
    try {
        const { name } = req.body

        const categorycrate = await prisma.category.create({
            data:{
                name: name
            }
        })
        console.log(categorycrate)
        res.send('Create category success')
    } catch (err) {
        console.log(err)
    }
}

export const Listcategory = async (req: Request, res: Response) => {
    try {
          const categorylist = await prisma.category.findMany()
          console.log(categorylist)
        res.status(200).json({
            message: 'Category list',
            categorylist
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}

export const Removecategory = async (req: Request, res: Response) => {
    try {

        const {id} = req.params
        
        const removecategory = await prisma.category.delete({
            where:{
                id: Number(id)
            }
        })
        console.log(removecategory)

        res.send('Hello Remove')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}