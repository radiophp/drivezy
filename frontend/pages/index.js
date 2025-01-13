import Home from '@/components/Authentication/SignInForm';
import SignInForm from "@/components/Authentication/SignInForm";



const Index = () => {
    console.log("process.env.NEXT_PUBLIC_BACKEND_URL"+process.env.NEXT_PUBLIC_BACKEND_URL)
  return (
    <>
      <SignInForm />
    </>
  );
}
export default Index;
