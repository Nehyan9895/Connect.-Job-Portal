import express from 'express';
import { recruiterController } from "../controllers/recruiterController";
import { jobController } from '../controllers/jobController';
import { upload } from '../config/multer';
import { authMiddleware } from '../middlewares/userAuth';
import { jobApplicationController } from '../controllers/jobApplicationController';

const router = express.Router();

router.post('/login',recruiterController.recruiterLogin)
router.post('/add-profile',upload.single('upload'),recruiterController.createProfile)
router.get('/candidate-details/:id',recruiterController.getCandidateById)
router.post('/create-job',jobController.createJob);
router.get('/home/:id',jobController.getAllJobsOfRecruiter);
router.get('/edit-job/:id',jobController.getJobById)
router.post('/edit-job',jobController.updateJob)
router.get('/applicants/:id',jobApplicationController.getJobApplicationByJob)
router.put('/applicants/:id', jobApplicationController.reviewApplication);
router.put('/applicants/view-resume/:id', jobApplicationController.viewResume);
router.put('/applicants/status/:id', jobApplicationController.updateApplicationStatus);






export default router;