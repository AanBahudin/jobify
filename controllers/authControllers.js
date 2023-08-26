import User from "../model/User.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError, NotFoundError} from '../errors/index.js'
import attachCookie from "../utils/attachCookiesToResponse.js"

const register = async(req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new BadRequestError('Please provide all values')
    }

    const isUserAlreadyExist = await User.findOne({email})
    if(isUserAlreadyExist) {
        throw new BadRequestError('Email already exist')
    }
    
    const user = await User.create(req.body)
    const token = user.createJWT()
    attachCookie({res, token})
    res.status(StatusCodes.CREATED).json({user, location: user.location})
}

const login = async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        throw new BadRequestError('Please Provide all values')
    }

    const user = await User.findOne({email: email}).select('+password')
    if(!user) {
        throw new NotFoundError('No email found!')
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT()
    user.password = undefined
    attachCookie({res, token})
    res.status(StatusCodes.OK).json({user, location: user.location})
}

const updateUser = async(req, res) => {
    const { email, name, lastName, location } = req.body

    if( !email || !name || !lastName || !location ) {
        throw new BadRequestError('Please provide all values')
    }

    const user = await User.findOne({_id: req.user.userId})

    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    await user.save()
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user, location: user.location})
}

const getCurrentUser = async(req, res) => {
    const user = await User.findOne({_id: req.user.userId})
    res.status(StatusCodes.OK).json({user, location: user.location})
}

const logout = async(req, res) => {
    res.cookie('jbfy_user_jwt', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    })
    res.status(StatusCodes.OK).json({msg: 'user logged out!'})
}

export {
    register,
    login,
    updateUser,
    getCurrentUser,
    logout
}