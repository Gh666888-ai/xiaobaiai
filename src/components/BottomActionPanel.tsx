import Link from "next/link"
import { ArrowRight } from "lucide-react"
import styles from "@/components/learning/SupportPage.module.css"

type BottomAction = {
  href: string
  label: string
  tone?: "primary" | "secondary"
}

export function BottomActionPanel({
  eyebrow = "Next Step",
  title,
  text,
  actions,
}: {
  eyebrow?: string
  title: string
  text: string
  actions: BottomAction[]
}) {
  return (
    <section className={`${styles.panel} ${styles.bottomActionPanel}`}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.panelTitle}>{title}</h2>
        <p className={styles.panelDesc}>{text}</p>
      </div>
      <div className={styles.actions}>
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={action.tone === "primary" ? styles.primaryButton : styles.secondaryButton}
          >
            {action.label}
            <ArrowRight size={14} />
          </Link>
        ))}
      </div>
    </section>
  )
}
