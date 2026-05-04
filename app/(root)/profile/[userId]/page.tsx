const page = async (params:Promise<{userId:string}>) => {
  const {userId}=await params;


  return (
    <div>Profile {userId}</div>
  )
}

export default page
