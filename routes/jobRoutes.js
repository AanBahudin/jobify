import express from 'express'
import { getAllJobs, getSingleJob, updateJob, deleteJob, showStats, createJob } from '../controllers/jobsControllers.js'
import auth from '../middleware/auth.js'
import testUser from '../middleware/testUser.js'

const router = express.Router()

router.route('/').get(auth, getAllJobs).post(auth, testUser, createJob)
router.route('/stats').get(auth, showStats)
router.route('/:id').get(auth, getSingleJob).patch(auth, testUser, updateJob).delete(auth, testUser, deleteJob)

export default router