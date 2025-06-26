        import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
        import { ResponseType } from "@/types";
        import axios from "axios";


        const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

        //funtion that will handle the upload to cloudinary
        export const UPLOAD_IMAGE_TO_CLOUDINARY = async (
        file: { uri?: string } | string,
        folderName: string


        ): Promise<ResponseType> => { 
          try {
              if(!file) return {success: true, data:null}
              if (typeof file == "string" /*//that means the image is already uploaded and it is string*/) 
              { return { success: true, data: file }; }
              
              if (file && file.uri /* i.e there is a file with uri is used as it is object then it should be uploaded to cloudinary*/)
              {
                const formdata = new FormData(); 
                formdata.append("file", {
                  uri: file?.uri,
                  name: file?.uri?.split("/").pop()|| "image.jpg",
                  type: "image/jpeg",
                } as any);
                formdata.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); //default preset for cloudinary //Upload presets define a set of parameters to apply during uploads. Define once, and easily use on any upload flow.
                formdata.append("folder", folderName);
                

                //as we got all the data , upload and make api request POST to cloudinary
                const response = await axios.post(CLOUDINARY_API_URL, formdata, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                //console.log("upload image result ", response.data);

                return { success: true, data: response?.data?.secure_url }; 
                //"secure_url": "https://res.cloudinary.com/dogxjjjod/image/upload/v1742506314/users/exnyve3hu9ecktrpwnn2.jpg" secure url property gives
                //What is the secure_url Property?
                // The secure_url property is typically found in Cloudinary's API response when you upload an image, video, or other media. 
                // It provides a secure HTTPS URL for accessing the uploaded file. 
              }
                
          return{ success: false  }
        } catch (error : any) {
           console.log("got error uploading the image in cloudinary  : " + error);
           return { success: false, msg: error?.message || "could not upload the image"};

        }
 


        }



        export const getProfileImage = (file: any) =>
        {
        // if its a remote url
        //When file is a String (URL or Local Path)
        //✅ Image will be displayed if file is a valid image URL or file path.
        //
        if (file && typeof file == "string") return file;
        // if the file is an object
        if (file && typeof file == "object") return file.uri;
        //file.uri is the file location
        //If file is an object, it typically contains metadata about the image.
        // In React Native (especially with Expo ImagePicker), the file object looks like:
        // {
        //   uri: "file:///some-path/image.jpg",
        //   type: "image/jpeg",
        //   name: "image.jpg"
             //an object
        //}
        //✅ You need file.uri to extract the actual image path. If you just return file, it will not work because <Image /> expects a valid uri string.

        //but if both condition are false thewwn we use default png
        return require("../assets/images/sbcf-default-avatar.png")
}
        //FormData is like that lunchbox! Instead of food, it holds information (like your name, a picture, or a message).
// Then, it sends everything neatly packed to a website (just like your teacher taking the lunchbox to the picnic).
//
//Why is as any used?
// TypeScript expects the second argument of formData.append(name, value) to be either:

// A string
// A Blob
// A File
// However, in your code, the object being passed:
// {
//   uri: file?.uri,
//   name: file?.uri?.split.pop() || "image.jpg",
//   type: "image/jpeg"
// }
// is not a File or Blob. Instead, it is a plain JavaScript object.

// Since TypeScript will throw an error (because it doesn't match the expected types), as any is used to silence TypeScript's type checking, forcing it to accept the object.
//
//
// What is AJAX?
// AJAX (Asynchronous JavaScript and XML) is a technique that allows web pages to send and receive data from a server without reloading the page.
// 👉 It helps create dynamic, fast, and interactive web applications by updating only parts of the webpage instead of reloading the entire page.

//It formats the data in the same way as a standard HTML form submission with enctype="multipart/form-data".
// //Why use FormData?
// It helps send form data dynamically via JavaScript without reloading the page.
// It automatically handles file uploads (e.g., images, PDFs).
// It supports appending multiple values for the same key (useful for checkboxes or multiple file uploads).
// It ensures the correct format for a multipart/form-data request.

// //What is multipart/form-data?
// multipart/form-data is a content type (MIME type) used to send files and form data in HTTP requests. It is commonly used when submitting forms that include file uploads.
// When a form is submitted with enctype="multipart/form-data", the data is split into multiple parts, allowing files, text, and other data to be sent together.

// Why is multipart/form-data Needed?
// Supports file uploads 📂 (Unlike application/x-www-form-urlencoded)
// Handles binary data properly (Images, PDFs, etc.)
// Allows sending text + files in a single request
// Used in APIs, AJAX, and form submissions


export const getfilePath = (file: any) =>
{
  if (file && typeof file == "string") return file;
        // if the file is an object
  if (file && typeof file == "object") return file.uri;
  //else
  return null;
}