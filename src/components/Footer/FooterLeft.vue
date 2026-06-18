<template>
    <div class="fixed left-8 bottom-0">
        <ul class="flex flex-col gap-4">
            <li class="transition-all hover:-translate-y-1 hover:text-primary">
                <a target="_blank" rel="noreferrer" aria-label="GitHub" href="https://github.com/serifselim">
                    <ion-icon name="logo-github" />
                </a>
            </li>
            <li class="transition-all hover:-translate-y-1 hover:text-primary">
                <a target="_blank" rel="noreferrer" aria-label="LinkedIn" href="https://www.linkedin.com/in/serifselim/">
                    <ion-icon name="logo-linkedin" />
                </a>
            </li>
            <li class="transition-all hover:-translate-y-1 hover:text-primary">
                <a target="_blank" rel="noreferrer" aria-label="Instagram" href="https://www.instagram.com/yvzserif/">
                    <ion-icon name="logo-instagram" />
                </a>
            </li>
        </ul>
        <div class="mt-5 h-20 w-px bg-dark mx-auto" />
    </div>
</template>
<script>
export default {
    name: "FooterLeft"
}
</script>
