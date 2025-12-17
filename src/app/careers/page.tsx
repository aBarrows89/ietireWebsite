"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CareersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with careers hash
    router.replace("/#careers");

    // After navigation, scroll to center the careers section
    setTimeout(() => {
      const careersSection = document.getElementById("careers");
      if (careersSection) {
        const elementRect = careersSection.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 4);
        window.scrollTo({
          top: middle,
          behavior: "smooth"
        });
      }
    }, 100);
  }, [router]);

  // Show nothing while redirecting (brief flash)
  return null;
}
