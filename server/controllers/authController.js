import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req ,res) =>{
    try{
        const {email,password,name} = req.body;
        if(!email || !password || !name ) return res.status(400).json({message: "Các trường bắt buộc bị thiếu!"});
        const existEmail = await prisma.users.findUnique({where: {email: email}});
        if(existEmail) return res.status(400).json({message: "Email đã tồn tại!"});
        const hashPassword = await bcrypt.hash(password,10);
        const user = await prisma.users.create({data : {email: email, password: hashPassword, name: name}});
        return res.status(201).json({email: user.email, name: user.name});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Có lỗi server!"});
    }
}

export const login = async (req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({message: "Các trường bắt buộc bị thiếu!"});
        const user = await prisma.users.findUnique({where : {email: email}});
        if(!user) return res.status(401).json({message: "Tài khoản hoặc mật khẩu không đúng!"});
        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass) return res.status(401).json({message: "Email hoặc mật khẩu không đúng!"});
        const token = jwt.sign({userId : user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json({token, email: user.email, name: user.name,});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Có lỗi server!"});
    }
}

export const me = async (req,res) => {
    try{
        const userId = req.userId;
        if(!userId) return res.status(401).json({message: "Không tìm thấy token!"});
        const user = await prisma.users.findUnique({where : {id: userId}});
        if(!user) return res.status(404).json({message: "Không tìm thấy user!"});
        return res.status(200).json({id: user.id, email: user.email, name: user.name, avatarUrl: user.avatar_url, createdAt : user.created_at});
    }catch(err){
        console.log(err);
        return res.status(500).json({message :"Có lỗi server!"})
    }
}