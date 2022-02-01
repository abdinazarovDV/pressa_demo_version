import { Router } from "express";

const router = Router();

import { postsController } from "#cont/posts";
import validation from "#lib/validation";

router.route('/')
    .get(postsController.GET)
    .post(validation, postsController.POST)
    .put(postsController.PUT)

export default router;