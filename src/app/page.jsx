import Image from "next/image";
import styles from "./page.module.sass";
import AuthNav from "@/app/components/AuthNav";
import TestBtn from "@/app/components/TestBtn";
// import generalStyles from "@/app/general.module.sass"; 
import { getUserFromServer } from "@/app/actions/auth/getUser"; // getUser action 

export default async function Home() {
  const userData = await getUserFromServer();
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <b className={styles.status}>{userData ? (<h4>Welcome {userData.email}, id: ({userData.id})</h4>) : (<h4>Logged out</h4>)}</b>

        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <AuthNav />

        <TestBtn />

      </main>


      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
