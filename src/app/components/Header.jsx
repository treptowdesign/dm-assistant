import Image from "next/image";
import styles from "@/app/page.module.sass";

export default function Header() {
    return (
        <header className={styles.header}>
            <Image
                className={styles.logo}
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
            />
        </header>
    );
}