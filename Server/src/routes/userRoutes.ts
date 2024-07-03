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
router.post('/profile', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), (req, res) => {userController.createProfile(req as any, res);})
router.post('/forgot-password',userController.sendForgotOtp)
router.post('/verify-forget-password',userController.verifyForgetOtp)
router.post('/reset-password',userController.resetPassword);
router.get('/:id/home', jobController.getJobsForCandidate);
router.get('/apply-job/:id',jobController.getJobById)
router.post('/apply-job',jobApplicationController.applyForJob)
router.get('/applied-jobs/:id',jobApplicationController.getJobApplications)

export default router;
