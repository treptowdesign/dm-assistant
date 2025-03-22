import Image from "next/image";
import styles from "./page.module.sass";
import AuthNav from "@/app/components/AuthNav";
import TestBtn from "@/app/components/TestBtn"; 
import { getUserFromServer } from "@/app/actions/auth/getUser"; // getUser action 

export default async function Home() {
  const userData = await getUserFromServer();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <b className={styles.status}>
          {userData ? (<h4>Welcome {userData.email}, id: ({userData.id})</h4>) : (<h4>Logged out</h4>)}
        </b>
        <AuthNav />
        <TestBtn />  {/* For Testing our Protected Route */}
      </main>
    </div>
  );
}
