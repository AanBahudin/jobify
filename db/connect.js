import mongoose from "mongoose";

const connect = async(mongoURL) => {
    return mongoose.connect(mongoURL)
}

export default connect