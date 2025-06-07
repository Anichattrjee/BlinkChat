import mongoose, {Schema} from "mongoose";
import bcrypt, { genSalt } from "bcryptjs";

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        Unique:true
    },
    password:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:"",
    },
    nativeLanguage:{
        type:String,
        default:"",
    },
    learningLanguage:{
        type:String,
        default:"",
    },
    location:{
        type:String,
        default:""
    },
    isOnboarded:{
        type:Boolean,
        default:false
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
},{timestamps:true});



//pre hook
//password hashing
userSchema.pre("save",async function (next){
    if(!this.isModified("password"))
    {
        return next();
    }
    try {
        const salt =await genSalt(10);
        const hashedPassword=await bcrypt.hash(this.password,salt);
        this.password=hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword=async function(enteredPassword)
{
    const isPasswordCorrect=await bcrypt.compare(enteredPassword,this.password);
    return isPasswordCorrect;
}


const User=mongoose.model("User",userSchema);


export default User;