"use client"
import AuthFormOfUsername from "@/components/forms/AuthForm"
import { signInWithCredentials } from "@/lib/actions/auth.action"
import { SignInSchema } from "@/lib/validation"

const page = () => {
  return (
    <>
    <AuthFormOfUsername 

    formtype="SIGN_IN" 
    schema={SignInSchema}
    defaultValues={{email:"",password:""}} 
    onSubmit={signInWithCredentials}

    />
    </>
  )
}

export default page
