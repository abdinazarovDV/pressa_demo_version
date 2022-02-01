import { Router } from "express";

const router = Router();

import { categoryController } from "#cont/category";

router.route('/')
    .get(categoryController.GET)

export default router;