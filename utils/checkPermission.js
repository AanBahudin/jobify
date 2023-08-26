import { UnauthenticatedError } from "../errors/index.js"

const checkPermission = (userJob, accessJobUser) => {
    if (userJob.toString() !== accessJobUser) {
        throw new UnauthenticatedError('there is no job')
    }
    return
}

export default checkPermission