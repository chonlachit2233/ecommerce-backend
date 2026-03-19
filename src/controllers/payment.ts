import { Request, Response } from "express"
import prisma from "../config/prisma";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export const Payment = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await prisma.cart.findFirst(({
            where: {
                userId: req.user?.id
            }
        }))
        if(!cart){
            return res.status(401).json({message:'Not cart'})
        }
        const amountTHB = cart.cartTotal * 100
    


        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountTHB,
            currency: 'thb',
            automatic_payment_methods: {
                enabled: true,
            },
        });
        console.log("SERVER client_secret:", paymentIntent.client_secret);
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }

}