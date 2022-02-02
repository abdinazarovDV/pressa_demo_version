import { Router } from "express";

const router = Router();

import { postsController } from "#cont/posts";
import validation from "#lib/validation";

router.route('/')
    .get(postsController.GET)
    .post(validation, postsController.POST)
router.route('/speakers')
    .get(postsController.GETSPEAKERS)
router.route('/:postId')
    .get(postsController.GETWITHID)

export default router;