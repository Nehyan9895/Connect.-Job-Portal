import express from 'express';
import { adminController } from '../controllers/adminController';

const router = express.Router();

router.post('/login',adminController.adminLogin)
router.get('/user-list', adminController.getAllCandidatesWithUserInfo);
router.patch('/users/:id/verification', adminController.updateUserVerificationStatus);
router.patch('/recruiters/:id/verification',adminController.updateRecruiterVerificationStatus);
router.get('/recruiter-list',adminController.getAllRecruitersWithUserInfo);



export default router;