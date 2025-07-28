import { ResponseType, WalletType } from "@/types";
import { UPLOAD_IMAGE_TO_CLOUDINARY } from "./imageService";
import { collection, deleteDoc, doc , setDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";


//: Promise<void> when you want to explicitly define that the function returns a promise but does not return a value.
//takes wallet data as input , input parameters are walletData
export const create_or_update_Wallet = async (
    walletData:  Partial<WalletType>
) : Promise<ResponseType> =>
{
    try {
        let walletToSave = { ...walletData };
        if (walletData.image)
        {
            const ppUploadRes = await UPLOAD_IMAGE_TO_CLOUDINARY(walletData.image, /*folder name*/ "wallets")
            if (!ppUploadRes.success)
            {
                return { success: false, msg:ppUploadRes.msg  || "error uploading wallet image"};
            }
            walletToSave.image = ppUploadRes.data;
        }
        if (!walletData?.id)
        {
            //new wallet
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpense = 0;
            walletToSave.created= new Date();
        }
        const walletRef = walletData?.id ? doc(firestore, "wallets", walletData?.id) : doc(collection(firestore , "wallets")) // : doc(collection(firestore) part is creation of new wallet dynamically   
        await setDoc(walletRef, walletToSave , {merge : true}); //updates only if the data provided set or update the wallet data
        return { success: true,  data: { ...walletData, id: walletRef.id }}
       
    }
    catch (error: any) {
       console.log("error creating or updating wallet", error);
       return {success: false , msg : error.message}
        }
}



export const deleteW = async (walletId : string): Promise<ResponseType> =>
{
    try {
        const walletRef = doc(firestore, "wallets", walletId);
        await deleteDoc(walletRef);
        //TODO : delete all transactions of the wallet
        return {success: true }
    } catch (error: any) {
        console.log("error deleting wallet", error);
        return {success: false , msg : error?.msg}
    }

}
//
// If walletData.id exists:

// It means the wallet already exists, so it gets a reference to that specific document using doc(firestore, "wallets", walletData.id).
// This fetches a document from the wallets collection with the given id (used for updating an existing wallet).
// If walletData.id does NOT exist:

// A new document is dynamically created in the wallets collection using doc(collection(firestore, "wallets")).
// Firestore will automatically generate a unique ID for this new wallet.


//
//setDoc() writes data to Firestore.
// walletRef specifies the document to update or create.
// walletToSave contains the data that needs to be saved.
// { merge: true } ensures:
// If the document exists, only the provided fields are updated (it won’t overwrite the entire document).
// If the document doesn’t exist, a new one is created.