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
router.get('/profile/:id',authMiddleware.verifyToken,userController.getCandidateById)
router.put('/profile/:id',authMiddleware.verifyToken,userController.updateCandidateProfile)
router.put('/profile/education/:id',authMiddleware.verifyToken, userController.updateCandidateEducation);
router.put('/profile/experience/:id',authMiddleware.verifyToken, userController.updateCandidateExperience);
router.put('/profile/skills/:id',authMiddleware.verifyToken, userController.updateCandidateSkills);
router.post('/add-profile',authMiddleware.verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), (req, res) => {userController.createProfile(req as any, res);})
router.post('/forgot-password',userController.sendForgotOtp)
router.post('/verify-forget-password',userController.verifyForgetOtp)
router.post('/reset-password',userController.resetPassword);
router.get('/:id/home',authMiddleware.verifyToken, jobController.getJobsForCandidate);
router.get('/apply-job/:id',authMiddleware.verifyToken,jobController.getJobById)
router.post('/apply-job',authMiddleware.verifyToken,jobApplicationController.applyForJob)
router.get('/applied-jobs/:id',authMiddleware.verifyToken,jobApplicationController.getJobApplications)
router.get('/job-application-statistics/:id',authMiddleware.verifyToken, jobApplicationController.getJobApplicationStatistics);
router.get('/profile',authMiddleware.verifyToken,userController.getCandidateById)
router.get('/users/:userId/messaged-users', authMiddleware.verifyToken,userController.getMessagedUsers);
router.get('/recruiter-details/:id',authMiddleware.verifyToken,userController.getRecruiterById)

export default router;
