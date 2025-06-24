import { axiosInstance } from "./axios";

export const signup=async(signUpData)=>{
      const response=await axiosInstance.post("/auth/signup",signUpData);
      return response.data;
}

export const login=async(loginData)=>{
      const response=await axiosInstance.post("/auth/login",loginData);
      return response.data;
}

export const logout=async(l)=>{
      const response=await axiosInstance.get("/auth/logout");
      return response.data;
}

export const getAuthUser=async() =>{
      try {
            const response=await axiosInstance.get("/auth/me");
            return response.data;
      } catch (error) {
            console.log("error in getauthuser: ",error);
            return null;
      }
};

export const completeOnboarding=async(onboardingData)=>{
      const response=await axiosInstance.post("/auth/onboarding",onboardingData);
      return response.data;
}