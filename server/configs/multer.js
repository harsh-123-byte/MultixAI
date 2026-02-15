// Multer is a middleware for Node.js + Express that is used to handle file uploads (like images, PDFs, videos, etc.) from HTML forms.
// Express koi bhi images ya videos ko process nhi kar pata hai by itself so for that process we use the multer middleware.

import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({storage})