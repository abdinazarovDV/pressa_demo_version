import { Router } from "express";

const router = Router();

import { adminController } from "#cont/admin";

router.route('/')
    .get(adminController.GET)
    .put(adminController.PUT)
router.route('/delete')
    .get(adminController.DELDONE)

export default router;