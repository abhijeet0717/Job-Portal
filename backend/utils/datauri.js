import DataUriParser from "datauri/parser.js";
import path from "path";
//Import path: This line imports the path module from Node.js, which provides utilities for working with file and directory paths.

const getDataUri = (file) => {//This function takes a file object as an argument and returns a Data URI string.
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();//extracts the file extension from the original file name using the path.extname method and converts it to a string.
    return parser.format(extName,file.buffer);
    //uses the format method of the DataUriParser instance to convert the file buffer into a Data URI string, including the file extension
    //as multer store the file in buffer so used file.buffer
}

export default getDataUri;