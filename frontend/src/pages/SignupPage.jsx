import React, { useState } from "react";
import { ShipWheel } from "lucide-react";
import { Link } from "react-router";
import useSignup from "../hooks/useSignup";

const SignupPage = () => {
  const [signUpData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  //this is without using custom hook
  // const queryClient=useQueryClient();
  // const {mutate: signUpMutation, isPending, error}= useMutation({
  //   mutationFn:signup,
  //   onSuccess:queryClient.invalidateQueries({queryKey:['authUser']})
  // });

  const {error,isPending,signUpMutation}=useSignup();

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation(signUpData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-2xl shaodw-xl overflow-hidden">
        {/* Signup Form-left side */}

        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col ">
          {/* Logo */}
          <div className="mb-4 flex justify-center items-center gap-2">
            <ShipWheel className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r  from-primary to-secondary tracking-wider">
              BlinkChat
            </span>
          </div>

          {/* Error if any */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error?.response.data?.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Welcome To BlinkChat
                  </h2>
                  <p className="text-sm opacity-70">
                    Join Blinkchat and start your language learning Journey
                  </p>
                </div>
                {/* FullName */}
                <div className="space-y-3 ">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>

                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3 ">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <input
                      type="text"
                      placeholder="john@example.com"
                      className="input input-bordered w-full"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignupData({ ...signUpData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password*/}
                <div className="space-y-3 ">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>

                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-sx mt-1 opacity-70">
                      Password must be 6 characters long
                    </p>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2 ">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm "
                        required
                      />
                      <span className="text-xs loading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>

                  <button className="btn btn-primary w-full " type="submit">
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Loading
                      </>
                    ): ("Create Account")}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Already haave an account ?{" "}
                      <Link
                        to="/login"
                        className="text-primary hover:underline"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SignupPage;
