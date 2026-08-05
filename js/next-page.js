export function nextPage() {
    const nextPageContainer = document.querySelector('.next-up-container');
    const nextPageRevealContainer = document.querySelector('.next-up-reveal-container');

    if (nextPageContainer) {
        gsap.to(nextPageRevealContainer, {
            scrollTrigger: {
                trigger: nextPageContainer,
                start: 'top top',
                end: '+=100%',
                scrub: true,
                pin: true,
                markers: true
            },
            clipPath: 'inset(0%)',
            ease: 'none',
        });
    }
}