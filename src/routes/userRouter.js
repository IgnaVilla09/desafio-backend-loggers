import  { Router } from "express"
import {auth, premiumAuth} from "../middlewares/auth.js"
import {usuariosModelo} from "../dao/models/usuario.modelo.js"

export const router = Router()

router.get("/", auth, async (req, res) => {

    const user = req.user

    if(user._id){
        const userId = user._id
        res.render("changeroles", {userId})
    }else {
        const userId = user.userID
        res.render("changeroles", {userId})
    }

})

router.get("/premium/:uid",auth , async (req, res) => {

const userId = req.params.uid
const user = await usuariosModelo.findById(userId)


if(user.role == "Premium"){
    try {
        await usuariosModelo.findByIdAndUpdate(userId, {role: "usuario"})
        req.user.role = "usuario"
        res.redirect("/products")
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Error al cambiar el rol del usuario: ${error.message}`})
    }
}else {
    try {
        await usuariosModelo.findByIdAndUpdate(userId, {role: "Premium"})
        req.user.role = "Premium"
        res.redirect("/products")
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Error al cambiar el rol del usuario: ${error.message}`})
    }
}
})