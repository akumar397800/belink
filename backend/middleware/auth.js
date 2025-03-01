const auth = async (request, response, next) => { 
    try {
        const token = request.cookies.accessToken||request?.header?.authorization?.split(" ")[1] //Beared
        if (!token) { 
            return response.status(401).json({
                message:"Provide Token"
            })
        }

        const decode = await Jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
        
        console.log('decode', decode)
        if (!decode) { 
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
                
            })
        }
        request.userId = decode.id
        next()

    } catch (err) {
        return response.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

export default auth