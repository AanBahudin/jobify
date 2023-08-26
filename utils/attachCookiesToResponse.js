const attachCookie = ({res, token}) => {
    const oneDay = 1000 * 60 * 60 * 24

    res.cookie('jbfy_user_jwt', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production'
    })
}

export default attachCookie