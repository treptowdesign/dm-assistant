import { getUserFromServer } from "@/app/actions/auth/getUser"; 
import { redirect } from "next/navigation";

export default async function CampaignsLayout({ children }) {

  const user = await getUserFromServer(); // check if user is logged in
  if (!user) {
    redirect("/"); // redirect to home if not logged in
  }
  
  return (
    <div>
        {children}
    </div>
  );
}