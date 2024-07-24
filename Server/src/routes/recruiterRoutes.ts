import express from 'express';
import { recruiterController } from "../controllers/recruiterController";
import { jobController } from '../controllers/jobController';
import { upload } from '../config/multer';
import { authMiddleware } from '../middlewares/userAuth';
import { jobApplicationController } from '../controllers/jobApplicationController';

const router = express.Router();

router.post('/login',recruiterController.recruiterLogin)
router.post('/add-profile',upload.single('upload'),recruiterController.createProfile)
router.get('/profile/:id',recruiterController.getProfile)
router.put('/profile/:id',recruiterController.updateRecruiterProfile)
router.put('/profile/company-location/:id', recruiterController.updateCompanyLocations);
router.get('/candidate-details/:id',recruiterController.getCandidateById)
router.get('/company-locations/:userId', recruiterController.getCompanyLocations);
router.post('/create-job',jobController.createJob);
router.get('/home/:id',jobController.getAllJobsOfRecruiter);
router.get('/edit-job/:id',jobController.getJobById)
router.post('/edit-job',jobController.updateJob)
router.get('/applicants/:id',jobApplicationController.getJobApplicationByJob)
router.put('/applicants/:id', jobApplicationController.reviewApplication);
router.put('/applicants/view-resume/:id', jobApplicationController.viewResume);
router.put('/applicants/status/:id', jobApplicationController.updateApplicationStatus);
router.post('/interviews/schedule', recruiterController.scheduleInterview);
router.get('/interviews',recruiterController.getAllInterviews);
router.post('/join-room', recruiterController.joinRoom);
router.post('/signal', recruiterController.signal);









export default router;