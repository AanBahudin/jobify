const ErrorHandler = (err) => {
    console.log(err);
    res.status(500).json({msg: 'there was an error'})

}

export default ErrorHandler