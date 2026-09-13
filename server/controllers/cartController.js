

// update User cartData :/api/cart/update

import User from "../models/User.js"

export const updateCart = async (req, res )=>{

    try {
        // userId vient du middleware authUser (jeton vérifié), jamais du body :
        // sinon n'importe quel utilisateur connecté pourrait écraser le panier d'un autre.
        const { cartItems } = req.body
        const userId = req.userId
        await User.findByIdAndUpdate(userId, {cartItems})
        res. json({success:true, message:'Cart Updated' })
    } catch (error) {
        console.log(error.message)
        res.json({ success:false, message:error.message })
    }


}