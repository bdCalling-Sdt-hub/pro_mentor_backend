"use strict";
// import { Request } from 'express';
// import fs from 'fs';
// import multer from 'multer';
// const fileUpload = (uploadDirectory: string) => {
//   if (!fs.existsSync(uploadDirectory)) {
//     fs.mkdirSync(uploadDirectory, { recursive: true });
//   }
//   const storage = multer.diskStorage({
//     destination: function (req: Request, file, cb) {
//       cb(null, uploadDirectory);
//     },
//     filename: function (req: Request, file, cb) {
//       const parts = file.originalname.split('.');
//       let extenson;
//       if (parts.length > 1) {
//         extenson = '.' + parts.pop();
//       }
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(
//         null,
//         parts.shift()!.replace(/\s+/g, '_') + '-' + uniqueSuffix + extenson,
//       );
//     },
//   });
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
// Create a generic file upload function that accepts a directory
const fileUpload = (uploadDirectory) => {
    // Ensure the directory exists or create it
    if (!fs_1.default.existsSync(uploadDirectory)) {
        fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            // Set destination based on the provided upload directory
            // console.log(file);
            // console.log(req);
            if (file.fieldname === 'introVideo' || file.fieldname === 'video') {
                cb(null, './public/uploads/video');
            }
            else {
                cb(null, uploadDirectory);
            }
        },
        filename: function (req, file, cb) {
            // Generate a unique file name
            const parts = file.originalname.split('.');
            let extension;
            if (parts.length > 1) {
                extension = '.' + parts.pop();
            }
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, parts.shift().replace(/\s+/g, '_') + '-' + uniqueSuffix + extension);
        },
    });
    const upload = (0, multer_1.default)({
        storage,
        limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit for files
        fileFilter: (req, file, cb) => {
            // Check file type for video or document
            const allowedMimeTypes = [
                'image/png',
                'image/jpg',
                'image/jpeg',
                'image/svg',
                'image/webp',
                'application/octet-stream',
                'image/svg+xml',
                'video/mp4',
                'video/avi',
                'video/mov',
                'video/mkv',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type!'));
            }
        },
    });
    return upload;
};
exports.default = fileUpload;
