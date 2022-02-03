import { Router } from "express";

const router = Router();

import { authController } from "#cont/authorization";

router.route('/login')
    .post(authController.POST_LOGIN);


export default router;