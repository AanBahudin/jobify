import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError, BadRequestError, NotFoundError } from '../errors/index.js'
import mongoose from "mongoose";
import moment from 'moment'
import Job from "../model/Job.js";
import checkPermission from "../utils/checkPermission.js";

const createJob = async(req, res) => {
    const {position, company} = req.body

    if (!position || !company) {
        throw new BadRequestError('Please Provide All Values')
    }

    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const getAllJobs = async(req, res) => {
    const { search, status, jobType, sort } = req.query

    const queryObject = {
        createdBy: req.user.userId
    }

    if (status !== 'all') {
        queryObject.status = status
    } 

    if (jobType !== 'all') {
        queryObject.jobType = jobType
    }

    if (search) {
        queryObject.position = {$regex: search, $options: 'i'}
    }

    let result = Job.find(queryObject)

    if (sort === 'latest') {
        result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt');
    }
    if (sort === 'a-z') {
        result = result.sort('position');
    }
    if (sort === 'z-a') {
        result = result.sort('-position');
    }

    // setup pagination
    const page = Number(req.query.page) || 1    // pag
    const limit = Number(req.query.limit) || 10     // total job yang akan ditampilkan
    const skip = (page - 1) * limit     // total job yang diskip/tidak diambil
    result = result.skip(skip).limit(limit) 

    const jobs = await result

    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs / 10);

    res.status(StatusCodes.OK).json({jobs, totalJobs, numOfPages})
}

const getSingleJob = async(req, res) => {
    const {id} = req.params

    const job = await Job.find({createdBy: req.user.userId, _id: id})
    if (!job) {
        throw new NotFoundError('cannot find job')
    }

    res.status(StatusCodes.OK).json({job})
}

const updateJob = async(req, res) => {
    const {id: jobId} = req.params
    const { company, position, jobLocation, status, jobType } = req.body
    
    if (!company || !position) {
        throw new BadRequestError('Please provide all values!')
    }

    const job = await Job.findOne({_id: jobId, createdBy: req.user.userId})
    if (!job) {
        throw new NotFoundError('cannot find job')
    }

    checkPermission(job.createdBy, req.user.userId)

    job.position = position || job.position
    job.company = company || job.company
    job.jobLocation = jobLocation || job.jobLocation
    job.status = status || job.jobLocation
    job.jobType = jobType || job.jobType

    await job.save()
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async(req, res) => {
    const {id} = req.params

    const job = await Job.findOne({_id: id, createdBy: req.user.userId})
    if (!job) {
        throw new NotFoundError('cannot find job')
    }

    checkPermission(job.createdBy, req.user.userId)
    await job.deleteOne()
    res.status(StatusCodes.OK).json({msg: 'Success! Job removed'})
}

const showStats = async(req, res) => {

    let stats = await Job.aggregate([
        { $match: { createdBy : new mongoose.Types.ObjectId(req.user.userId) } },   // pada aggregate, $match berfungsi sebagai filter
        { $group: {_id: '$status', count: { $sum: 1 } } }
    ])

    stats = stats.reduce((acc, curr) => {
        const {_id: title, count} = curr
        acc[title] = count
        return acc
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        decline: stats.declined || 0,
    }

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, },
            count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },     // mengembalikan data terbaru
        { $limit: 6 },  // batas data yang dikembalikan oleh database
    ]);

    monthlyApplications = monthlyApplications.map((item) => {
        const {_id: {year, month}, count} = item

        const date = moment().month(month-1).year(year).format('MMM Y')
        return {date, count }
    }).reverse()

    res.status(StatusCodes.OK).json({defaultStats, monthlyApplications})
}

export {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob,
    showStats
}