import express from 'express';
import { userController } from '../controllers/userController';
import { upload } from '../config/multer';
import { authMiddleware } from '../middlewares/userAuth';
import { jobController } from '../controllers/jobController';
import { jobApplicationController } from '../controllers/jobApplicationController';


const router = express.Router();

router.post('/signup', userController.signup);
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);
router.post('/login',userController.userLogin)
router.get('/profile/:id',userController.getCandidateById)
router.put('/profile/:id',userController.updateCandidateProfile)
router.put('/profile/education/:id', userController.updateCandidateEducation);
router.put('/profile/experience/:id', userController.updateCandidateExperience);
router.put('/profile/skills/:id', userController.updateCandidateSkills);
router.post('/add-profile', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), (req, res) => {userController.createProfile(req as any, res);})
router.post('/forgot-password',userController.sendForgotOtp)
router.post('/verify-forget-password',userController.verifyForgetOtp)
router.post('/reset-password',userController.resetPassword);
router.get('/:id/home', jobController.getJobsForCandidate);
router.get('/apply-job/:id',jobController.getJobById)
router.post('/apply-job',jobApplicationController.applyForJob)
router.get('/applied-jobs/:id',jobApplicationController.getJobApplications)
router.get('/job-application-statistics/:id', jobApplicationController.getJobApplicationStatistics);
router.get('/profile',userController.getCandidateById)
router.get('/users/:userId/messaged-users', userController.getMessagedUsers);
router.get('/recruiter-details/:id',userController.getRecruiterById)

export default router;
