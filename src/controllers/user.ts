import { Request, Response } from "express"
import prisma from "../config/prisma"
import { AddtoCartBody } from "../types/cart"

export const Getuser = async (req: Request, res: Response) => {
    try {
        const listuser = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                enabled: true,
                address: true
            }
        })
        console.log(listuser)

        res.send(listuser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const ChangstatusUser = async (req: Request, res: Response) => {
    try {
        const { id, enabled } = req.body


        const changstatusupdate = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                enabled: enabled
            }
        })
        console.log(changstatusupdate)
        res.status(200).json({
            message: 'Update ChangStaus success',
            changstatusupdate
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const ChangroleUser = async (req: Request, res: Response) => {
    try {
        const { id, role } = req.body
        console.log(id, role)

        const Updateroleuser = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                role: role
            }
        })
        console.log(Updateroleuser)
        res.status(200).json({
            message: 'Updateroleuser success',
            Updateroleuser
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const Addusercart = async (req: Request<{}, {}, AddtoCartBody>, res: Response) => {
    try {
        const { cart } = req.body
        console.log(cart)
        console.log(req.user?.id)

        const users = await prisma.user.findFirst({
            where: {
                id: Number(req.user?.id)
            }
        })
        console.log(users)

        if (!users) {
            return res.status(400).json({ message: 'User not found' })
        }

        const productoncart = await prisma.productOnCart.deleteMany({
            where: {
                cart: {
                    userId: users.id
                }
            }
        })

        const carts = await prisma.cart.deleteMany({
            where: {
                userId: users.id
            }
        })
        console.log(carts)

        let products = cart.map((itemp) => ({
            productId: itemp.id,
            count: itemp.count,
            price: itemp.price
        }))

        let Cartotal = products.reduce((sum, itemp) =>
            sum + itemp.price * itemp.count, 0)

        console.log(Cartotal)

        const newcart = await prisma.cart.create({
            data: {
                products: {
                    create: products
                },
                cartTotal: Cartotal,
                userId: users.id

            }
        })
        console.log(newcart)



        console.log(productoncart)

        res.send('Add Cart Ok')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const Getusercart = async (req: Request, res: Response) => {
    try {
        const getcartuser = await prisma.cart.findFirst({
            where: {
                userId: Number(req.user?.id)
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })
        console.log(getcartuser)
        res.json({
            products: getcartuser?.products,
            cartTotal: getcartuser?.cartTotal
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const emtyremovecart = async (req: Request, res: Response) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(req.user?.id)
            }
        })
        console.log(cart)

        if (!cart) {
            return res.status(400).json({ message: 'No Cart' })
        }

        await prisma.productOnCart.deleteMany({
            where: {
                cartId: cart.id
            }
        })

        const result = await prisma.cart.deleteMany({
            where: {
                userId: Number(req.user?.id)
            }
        })
        res.json({
            message: 'Cart success Delete',
            deletetedcount: result.count
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const AdduserAddress = async (req: Request, res: Response) => {
    try {
        const { address } = req.body
        console.log(address)

        const saveaddress = await prisma.user.update({
            where: {
                id: Number(req.user?.id)
            },
            data: {
                address: address
            }
        })
        res.json({
            ok: true, message: 'Save Address success'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const Saveuserorder = async (req: Request, res: Response) => {
    try {

        // console.log(req.body)

        // return res.send('Hello saveorder')







        const { id, amount, status, currency } = req.body

       


        const amountTHB = Number(amount) / 100
        const usercart = await prisma.cart.findFirst({
            where: {
                userId: Number(req.user?.id)
            },
            include: {
                products: true
            }
        })
        console.log(usercart)

        if (!usercart || usercart.products.length === 0) {
            return res.status(400).json({ message: 'cart is emtry' })

        }



        // for (const itemp of usercart.products) {
        //     console.log(itemp)

        //     const product = await prisma.product.findUnique({
        //         where: {
        //             id: itemp.productId
        //         },
        //         select: {
        //             quantity: true,
        //             title: true
        //         }
        //     })
        //     console.log(product)

        //     if (!product || itemp.count > product.quantity) {
        //         return res.status(400).json({ ok: false, message: `ขออภัยสินค้า ${product?.title || 'product'}หมด` })
        //     }

        // }

        const order = await prisma.order.create({
            data: {
                products: {
                    create: usercart.products.map((itemp) => ({
                        product: { connect: { id: itemp.productId } },
                        count: itemp.count,
                        price: itemp.price
                    }))
                },
                userId: Number(req.user?.id),
                carTotal: usercart.cartTotal,
                stripePaymentId: id,
                amount: amountTHB,
                status: status,
                currency: currency


            }
        })
        console.log(order)

        const bulkupdate = usercart.products.map((itemp) => ({
            where: {
                id: itemp.productId
            },
            data: {
                quantity: {
                    decrement: itemp.count
                },
                sold: {
                    increment: itemp.count
                }
            }
        }))

        await Promise.all(
            bulkupdate.map((updated) => prisma.product.update(updated))
        )

        console.log(bulkupdate)


        await prisma.cart.deleteMany({
            where: {
                userId: Number(req.user?.id)
            }
        })

        res.json({ ok: true, order })



    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const Getuserorder = async (req: Request, res: Response) => {
    try {
        const order = await prisma.order.findMany({
            where: {
                userId: Number(req.user?.id)
            },
            select: {
                products: {
                    select: {
                        product: true
                    }
                }
            }
        })
        if (order.length === 0) {
            return res.status(400).json({ ok: false, message: 'No order' })
        }
        res.json({ ok: true, order })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}