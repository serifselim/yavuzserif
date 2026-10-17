<template>
    <div class="fixed left-8 bottom-0">
        <ul class="flex flex-col gap-4">
            <li class="transition-all hover:-translate-y-1 hover:text-primary-text">
                <a target="_blank" rel="noreferrer" aria-label="GitHub" :href="site.github">
                    <ion-icon name="logo-github" />
                </a>
            </li>
            <li class="transition-all hover:-translate-y-1 hover:text-primary-text">
                <a target="_blank" rel="noreferrer" aria-label="LinkedIn" :href="site.linkedin">
                    <ion-icon name="logo-linkedin" />
                </a>
            </li>
            <li class="transition-all hover:-translate-y-1 hover:text-primary-text">
                <a target="_blank" rel="noreferrer" aria-label="Instagram" :href="site.instagram">
                    <ion-icon name="logo-instagram" />
                </a>
            </li>
        </ul>
        <div class="mt-5 h-20 w-px bg-dark mx-auto" />
    </div>
</template>
<script>
import { site } from "@/constants";
export default {
    name: "FooterLeft",
    data: () => ({ site }),
}
</script>
