// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// import { Router } from 'express';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const router = Router();

// // TODO: Define route to serve index.html

// export default router;

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Serve static files from the 'public' directory
// router.use(express.static(path.join(__dirname, 'public')));
router.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
  });
export default router;
