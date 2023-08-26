import { UnauthenticatedError } from '../errors/index.js'
import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
    const token = req.cookies.jbfy_user_jwt

    if (!token) {
        throw new UnauthenticatedError('Authentication Invalid')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const testUser = payload.userId === '64e5c9c47bc4fc5cd60ad6d7'

        req.user = {userId: payload.userId, testUser}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid')
    }

}

export default auth