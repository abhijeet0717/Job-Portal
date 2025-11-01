import multer from "multer";

const storage = multer.memoryStorage();
//Memory Storage: This line sets up a storage engine that stores the uploaded files in memory as Buffer objects. 
//This is useful for processing files directly in memory without saving them to the disk.
//in chai aur code we use diskstorage ( as we first store the file in disk and then upload it to cloudinary)

export const singleUpload = multer({storage}).single("file");//as the key of data in formdata is file so used single("file") to upload the file
//formData.append("file", input.file);
 
//best way is the way used by Chai aur code , disk storage one