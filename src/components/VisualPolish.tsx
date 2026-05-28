"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

const ENTRANCE_SELECTOR = [
  "main > section",
  "main > article",
  ".card",
  "main [class*='heroPanel']",
  "main [class*='sidePanel']",
  "main section[class*='sectionPanel']",
  "main details[class*='sectionPanel']",
  "main section[class*='subjectPanel']",
  "main section[class*='panel']",
  "main details[class*='details']",
].join(",")

const CARD_SELECTOR = [
  ".card",
  "a[class*='Card']",
  "article[class*='Card']",
  "div[class*='Card']",
  "section[class*='Card']",
  "a[class*='card']",
  "article[class*='card']",
  "div[class*='card']",
  "section[class*='card']",
  "a[class*='Button']",
  "button[class*='Button']",
  "a[class*='button']",
  "button[class*='button']",
  ".btn-primary",
  ".btn-outline",
  ".site-nav-link",
  ".site-login-link",
].join(",")

function getUniqueElements(selector: string) {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((element, index, list) => {
    if (element.closest(".xiaobai-panel")) return false
    if (element.matches(".xiaobai-launcher, .xiaobai-launcher *")) return false
    return list.indexOf(element) === index
  })
}

export function VisualPolish() {
  const pathname = usePathname()

  useEffect(() => {
    let cleanup = () => {}
    let cancelled = false

    import("gsap").then(({ gsap }) => {
      if (cancelled) return

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const ctx = gsap.context(() => {
        const nav = document.querySelector<HTMLElement>(".site-nav")
        const launcherBody = document.querySelector<HTMLElement>(".xiaobai-launcher .xiaobai-body")
        const animatedElements = new WeakSet<Element>()
        const observer = new IntersectionObserver(
          (entries) => {
            const entering = entries
              .filter((entry) => entry.isIntersecting)
              .map((entry) => entry.target as HTMLElement)
              .filter((element) => !animatedElements.has(element))

            if (!entering.length) return
            entering.forEach((element) => {
              animatedElements.add(element)
              observer.unobserve(element)
            })

            gsap.fromTo(
              entering,
              { y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.985 },
              {
                y: 0,
                scale: 1,
                duration: reduceMotion ? 0.001 : 0.58,
                ease: "power3.out",
                stagger: reduceMotion ? 0 : { each: 0.055, from: "start" },
                overwrite: "auto",
                clearProps: "transform",
              },
            )
          },
          { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
        )

        if (nav && !reduceMotion) {
          gsap.fromTo(
            nav,
            { y: -12, autoAlpha: 0.88 },
            { y: 0, autoAlpha: 1, duration: 0.48, ease: "power3.out", clearProps: "opacity,visibility,transform" },
          )
        }

        getUniqueElements(ENTRANCE_SELECTOR)
          .filter((element) => !element.hasAttribute("data-xb-no-polish"))
          .slice(0, 80)
          .forEach((element) => observer.observe(element))

        const interactiveTargets = getUniqueElements(CARD_SELECTOR).slice(0, 180)
        const removeHandlers = interactiveTargets.map((element) => {
          const isClickable = element.matches("a, button, [role='button'], .site-nav-link, .site-login-link, .btn-primary, .btn-outline, [class*='Button'], [class*='button']")
          const hoverScale = isClickable ? 1.018 : 1.01
          const hoverY = isClickable ? -2 : -3
          const onEnter = () => {
            if (reduceMotion) return
            gsap.to(element, { y: hoverY, scale: hoverScale, duration: 0.22, ease: "power2.out", overwrite: "auto" })
          }
          const onLeave = () => {
            if (reduceMotion) return
            gsap.to(element, { y: 0, scale: 1, duration: 0.32, ease: "power3.out", overwrite: "auto", clearProps: "transform" })
          }
          const onDown = () => {
            if (reduceMotion || !isClickable) return
            gsap.to(element, { scale: 0.985, duration: 0.1, ease: "power1.out", overwrite: "auto" })
          }
          const onUp = () => {
            if (reduceMotion || !isClickable) return
            gsap.to(element, { scale: hoverScale, duration: 0.16, ease: "power2.out", overwrite: "auto" })
          }

          element.addEventListener("pointerenter", onEnter)
          element.addEventListener("pointerleave", onLeave)
          element.addEventListener("pointerdown", onDown)
          element.addEventListener("pointerup", onUp)

          return () => {
            element.removeEventListener("pointerenter", onEnter)
            element.removeEventListener("pointerleave", onLeave)
            element.removeEventListener("pointerdown", onDown)
            element.removeEventListener("pointerup", onUp)
          }
        })

        const idleTween =
          launcherBody && !reduceMotion
            ? gsap.to(launcherBody, {
                y: -5,
                rotation: 1.6,
                duration: 2.8,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                overwrite: "auto",
              })
            : undefined

        cleanup = () => {
          observer.disconnect()
          idleTween?.kill()
          removeHandlers.forEach((remove) => remove())
        }
      })

      const previousCleanup = cleanup
      cleanup = () => {
        previousCleanup()
        ctx.revert()
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [pathname])

  return null
}
