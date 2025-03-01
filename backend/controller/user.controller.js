import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import uploadImageCloudinary from '../utils/uploadimagecloudinary.js'
import generateOTP from '../utils/generateOTP.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generateAccessToken from '../utils/generateAccessToken.js'
import generateRefreshToken from '../utils/generateRefreshToken.js'
import jwt from 'jsonwebtoken'

//const jwt = require('jsonwebtoken');
export async function registerUserController(request,response) {
    try {
        const { name, email, password } = request.body
        
        if (!name || !email || !password) {
            return response.status(404).json({
                message: 'provide name and email password',
                error: true,
                success: true
            })
        }

        const user = await UserModel.findOne({ email })

        if (user) { 
            return response.json({
                message: 'user already exists',
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)
        
        const payload = {
            name,
            email,
            password: hashPassword
        }
        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const verifyEmailurl = `${process.env.FRONTEND_URI}/verify-email?code=${save._id}`

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify email from belink",
            html: verifyEmailTemplate({
                name,
                url:verifyEmailurl
            })
        })

        return response.json({
            message: 'User registered successfully',
            error: false,
            success: true,
            data: save
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            erroe: true,
            success: fase
        })
    }
}

export async function verifyEmailController(request, response) {
    try { 
        const code = request.body
        const user = await UserModel.findOne({ _id: code })
        
        if (user) {
            return response.status(400).json({
                message: 'Invalid code',
                error: true,
                success: false
            })
        }


        const updateUser = await UserModel.updateOne({
            verify_email:true,
        })

        return response.json({
            message: 'User verified successfully',
            success: true,
            erroe: false,
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })
    }
}

//login Controller

export async function loginController(request, response) {
    try {
        const { email, password } = request.body
        
        if (!email || !password) { 
            return response.status(400).json({
                message: "provide email and password",
                success: false,
                error: true
            })
        }
        //code to find that the email exist in our database or not
        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            })
        }

        if (user.status !== 'Active') {
            return response.status(404).json({
                message: 'User is not active',
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)
        if (!checkPassword) {
            return response.status(404).json({
                message: 'Check Password',
                erroe: true,
                success: false
            })
        }

        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const cookieoption = {
            httpOnly: true,
            secure: true,
            sameSite:"None"
        }
        response.cookie('accessToken', accessToken, cookieoption)
        response.cookie('refreshToken', refreshToken, cookieoption)
        
        return response.json({
            message: "Login Successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,

            }
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
 }

//LOGOUT    
export async function logoutController(request, response) { 
    try {

        const userid = request.userId //middleware
        
        const cookieoption = {
            httpOnly: true,
            secure: true,
            sameSite:"None"
        }
        response.clearCookie('accessToken',cookieoption)
        response.clearCookie('refreshToken', cookieoption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        })
        
        return response.json({
            message: "Logout Successfully",
            error: false,
            success: true
        })
    } catch (error) { 
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export async function uploadAvatar(request, response) {
    try {
        const userid = request.userId //auth middleware
        const image = request.file  // multer middleware


        const upload= await uploadImageCloudinary(image)
        
        const updateUser = await UserModel.findByIdAndUpdate(userid, {
            avatar: upload.url
        })
        return response.json({
            message: "Upload profile",
            data: upload
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//update user details
export async function updateUserDetails(request, response) { 
    try { 
        const userid= request.userId //auth middleware
        const { name, email, mobile, password } = request.body

        let hashPassword=""
        
        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({_id:userid}, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })
                
            
        })

        return response.json({
            message : "Updated user successfully",
            success : true,
            error : false,
            data: updateUser
        })

    } catch(error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//forget password for user not loggged in 

export async function forgetPasswordController(request, response) {
    try {
        const { email } = request.body
        const user = await UserModel.findOne({ email })

        if (!user) { 
            return response.status(404).json({
                message: "Email not found",
                error: true,
                success:false
            })
        }

        const otp = generateOTP()
        const expireTime = new Date() + 60 * 60 * 1000 //otp expires in one hours
        
        const update = await UserModel.findByIdAndUpdate(user._id, {
            forget_password_otp: otp,
            forget_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sentTo: email,
            subject: 'Forgot Password from belink',
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })
        return response.json({
            message: "Check your email",
            error: false,
            success: true
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.otp
        if (!email || !otp) {
            return response.status(500).json({
                message: "Provide required email",
                error: true,
                success: false
            })
        }
        const user = await UserModel.findOne({ email })

        if (!user) { 
            return response.status(404).json({
                message: "Email not found",
                error: true,
                success:false
            })
        }
        const currentTime = new Date().toISOString()

        if (user.forget_password_expiry < currentTime) {
            return response.status(404).json({
                message: "Otp expired",
                error: true,
                success: false
            })
        }
        if (otp !== user.forget_password_otp) {
            return response.status(404).json({
                message: "Invalid Otp",
                error: true,
                success: false
            })
        }
        //if otp was not expired then
        return response.json({
            message: "Verified successfully",
            success: true,
            error: false
        })

    }
    catch (error) { 
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false

        })
    }
}

//reset the password
export async function resetpassword(request, response) { 
    try {
        const { email, newPassword, confirmPassword } = request.body
        if (!email || !newPassword|| !confirmPassword) { 
            return response.status(400).json({
                message: "Please provide your new password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(400).json({
                message: "Enail is not available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "New password and confirm password do not match",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)
        

        const update = await UserModel.update(user._id, {
            password: hashPassword
        })

        return response.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        })

    } catch (error) { 
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//refresh token password
export async function refreshToken(request, response) { 
    try {
        const refreshToken = request.cookies.refreshToken||request?.header?.authorization.split(" ")[1] //

        if (!refreshToken) { 
            return response.status(401).json({
                message: 'Invalid Token',
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return respond.status(401).json({
                message: "token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id
        
        const newAccessToken = await generateAccessToken(userId)

        const cookieoption = {
            httpOnly: true,
            secure: true,
            sameSite:"None"
        }
        response.cookie('accessToken', newAccessToken, cookieoption)
        return response.json({
            message: 'New Access token generated successfully',
            error: false,
            success: true
        })
    } catch (error) { 
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}