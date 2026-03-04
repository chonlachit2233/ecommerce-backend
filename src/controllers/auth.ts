import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import test from "node:test";

export const UserRegister = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        console.log(email, password)

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' })
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required.' })
        }

        const Useremail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        console.log(Useremail)

        if(Useremail) {
            return res.status(400).json({message:'Email already exists'})
        }

        const hasspassword = await bcrypt.hash(password, 10)

        console.log(hasspassword)

        const adduser = await prisma.user.create({
            data: {
                email: email,
                password: hasspassword
            }
        })

        console.log(adduser)



        res.send('Register success')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const UserLogin = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body
        console.log(email, password)

        const useremail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!useremail || !useremail.password) {
            return res.status(400).json({ message: 'user not found.' })
        }

        if (!useremail.enabled) {
            return res.status(400).json({ message: 'Access not defined' })
        }

        const match = await bcrypt.compare(password, useremail.password)

        if (!match) {
            return res.status(403).json({ message: 'Password not found.' })
        }

        const payload = {
            id: useremail.id,
            email: useremail.email,
            role: useremail.role
        }

        const securt = process.env.SELETE
        if (!securt) {
            return res.status(400).json({ message: 'SELETE is not defined.' })
        }

        const token = jwt.sign(payload, securt, {
            expiresIn: '1d'
        })

        return res.status(200).json({
            message: 'Login sucess',
            token, payload
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}
export const CerrentUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: req.user?.email!
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
        res.json({ user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}