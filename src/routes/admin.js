import { Router } from "express";

const router = Router();

import { adminController } from "#cont/admin";

router.route('/')
    .get(adminController.GET)
    .put(adminController.PUT)
router.route('/accepted')
    .get(adminController.GET_ACCEPTED)
router.route('/rejected')
    .get(adminController.GET_REJECTED)
export default router;