import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { UPLOAD_IMAGE_TO_CLOUDINARY } from "./imageService";



//: Promise<void> when you want to explicitly define that the function returns a promise but does not return a value.
export const updateUser = async (
    uid: string,
    updatedData : UserDataType
): Promise<ResponseType> =>
{
    try {
        //lets upload image in cloudinary
        if (updatedData.image && updatedData?.image?.uri)
        {
            const ppUploadRes = await UPLOAD_IMAGE_TO_CLOUDINARY(updatedData.image, /*folder name*/ "users")
            if (!ppUploadRes.success)
            {
                return { success: false, msg:ppUploadRes.msg  || "error uploading image"};
            }
            updatedData.image = ppUploadRes.data;
        }
            
        //we will have a userRef : firestore reference to the user document in the users collection
        const userRef = doc(firestore, "users", uid)
        //update the user data // updateDoc requires a reference and updated data list user reference will have only the refernce and the update data will help to update those specific data that we reffered and want to update
        await updateDoc (userRef, updatedData)
        return{success: true, msg: "updated successfully" }
        
    } catch (error: any) {
        console.log("error updating the user", error);
        return { success: false, msg: error?.message };
        
    }
}