import { Request, Response } from "express"
import prisma from "../config/prisma"
import { v2 as cloudinary } from 'cloudinary';
import { ImageType } from "../types/image";

export const Createproduct = async (req: Request, res: Response) => {
    try {
        const { title, description, price, quantity, categoryId, images } = req.body

        const createproduct = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),

                images: {
                    create: images.map((item: ImageType) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        console.log(createproduct)

        res.status(200).json({
            message: 'Create Success',
            createproduct
        })
    } catch (err) {
        console.log(err)
    }
}
export const Listproduct = async (req: Request, res: Response) => {
    try {
        const { count } = req.params
        console.log(count)
        const listproduct = await prisma.product.findMany({
            take: parseInt(count as string),
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true,
                images: true
            }
        })
        console.log(listproduct)
        res.status(200).json({
            message: 'List product success',
            listproduct
        })
    } catch (err) {
        console.log(err)
    }
}
export const Readproduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const readproduct = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                category: true,
                images: true
            }
        })
        console.log(readproduct)

        res.status(200).json({
            message: 'Read product success',
            readproduct
        })
    } catch (err) {
        console.log(err)
    }
}
export const Updateproduct = async (req: Request, res: Response) => {
    try {
        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id)
            }
        })

        const { title, description, price, quantity, categoryId, images } = req.body

        const updateproduct = await prisma.product.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),

                images: {
                    create: images.map((itemp: ImageType) => ({
                        asset_id: itemp.asset_id,
                        public_id: itemp.public_id,
                        url: itemp.url,
                        secure_url: itemp.secure_url
                    }))
                }
            }
        })
        console.log(updateproduct)

        res.status(200).json({
            message: 'Update product success',
            updateproduct
        })
    } catch (err) {
        console.log(err)
    }
}
export const Removeproduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deleteproduct = await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
        console.log(deleteproduct)
        res.status(200).json({
            message: 'Delete product successful',
            deleteproduct
        })
    } catch (err) {
        console.log(err)
    }
}
export const Listbyproduct = async (req: Request, res: Response) => {
    try {
        const { sort, order, limit } = req.body
        console.log(sort, order, limit)

        const listbyproduct = await prisma.product.findMany({
            take: limit,
            orderBy: {
                [sort]: order
            },
            include: {
                category: true
            }
        })


        res.status(200).json({
            message: 'Listbyprodutc success',
            listbyproduct

        })
    } catch (err) {
        console.log(err)
    }
}
const Queryproduct = async (req: Request, res: Response, query: string) => {
    try {

        const queryproduct = await prisma.product.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.status(200).json(queryproduct)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
const PriceProduct = async (req: Request, res: Response, priceRang: number[]) => {
    try {
        const priceproduct = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRang[0],
                    lte: priceRang[1]
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        console.log(priceproduct)
        res.status(200).json(priceproduct)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
const Categoryproduct = async (req: Request, res: Response, categoryId: number[]) => {
    try {
        const cagetoryprice = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((id) => Number(id))
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        console.log(cagetoryprice)
        res.status(200).json(cagetoryprice)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const Searchbyproduct = async (req: Request, res: Response) => {
    try {
        const { query, price, category } = req.body

        if (query) {
            console.log('query--->', query)
            await Queryproduct(req, res, query)
        }

        if (price) {
            console.log('price--->', price)
            await PriceProduct(req, res, price)
        }

        if (category) {
            console.log('category--->', category)
            await Categoryproduct(req, res, category)
        }
        res.status(200).json({
            message: 'Search product success'

        })
    } catch (err) {
        console.log(err)
    }
}


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!
});



export const createimage = async (req: Request, res: Response) => {
    try {


        const uploadResult = await cloudinary.uploader.upload(req.body.image, {
            public_id: `Take-${Date.now()}`,
            resource_type: 'auto',
            folder: 'ecom2026'
        })

        res.send(uploadResult)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const removeimages = async (req: Request, res: Response) => {
    try {
         
       
        const {public_id} = req.body
         console.log(public_id)
         cloudinary.uploader.destroy(public_id, (result: any)=>{
           res.send('remove image success!!!')
         })
        

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}