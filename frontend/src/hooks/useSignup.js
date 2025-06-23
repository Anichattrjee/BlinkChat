import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'

const useSignup = () => {
   const queryClient=useQueryClient();
  
    const {mutate, isPending, error}= useMutation({
      mutationFn:signup,
      onSuccess:queryClient.invalidateQueries({queryKey:['authUser']})
    });

    return {error, isPending, signUpMutation:mutate};
}

export default useSignup