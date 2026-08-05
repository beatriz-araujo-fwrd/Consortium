export function homepage() {
    document.addEventListener('wheel', () => {
        gsap.to('.scroll', {
            autoAlpha: 0,
            duration: 0.2,
        })
    }, { once: true })

    const root = document.querySelector('.mwg_effect014'),
        images = [],
        classes = ['format1', 'format2', 'format3']

    root.querySelectorAll('.medias img').forEach(image => {
        images.push(image.getAttribute('src'))
    })

    const imagesLength = images.length

    let incr = 0,
        currentIndex = 0

    // Pin the section for a scroll distance proportional to the image count, so the
    // shuffling effect has room to play out in place before the page continues
    // scrolling into whatever section comes after it.
    const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: `+=${imagesLength * 1200}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
    })

    document.addEventListener('wheel', (e) => {
        if (!trigger.isActive) return

        incr += Math.abs(e.deltaY); // Math.abs() to ignore the scroll direction

        if (incr > 600) {
            newImage()
            incr = 0; // Reset incr value
        }
    }, { passive: true })

    function newImage() {
        // We pick a random value from the list of predefined classes
        const randomIndex = Math.floor(Math.random() * classes.length),
            // We create an image
            image = document.createElement("img")

        // We assign it a URL and add a randomly chosen class
        image.setAttribute('src', images[currentIndex])
        image.classList.add(classes[randomIndex])

        // We add this image to the DOM
        root.appendChild(image);

        gsap.fromTo(image, {
            xPercent: -50 + (Math.random() - 0.5) * 100,
            yPercent: -50 + (Math.random() - 0.5) * 20,
            rotation: (Math.random() - 0.5) * 20,
            // Different values for X and Y to create a slight squish effect on appearance
            scaleX: 1.02,
            scaleY: 1.02,
            opacity: 0
        }, {
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            ease: 'power4.out',
            duration: 0.15
        })

        gsap.to(image, {
            // // Slightly reduce the image size
            // scaleX: 0.96,
            // scaleY: 0.96,
            // ease: 'power4.in',
            duration: .5,
            opacity: 0,
            delay: 2, // Wait before hiding
            onComplete: () => {
                // Remove the image from the DOM for better performance
                root.removeChild(image);
            }
        })

        // Loop back to the first item when we're out of range in our images array
        currentIndex = (currentIndex + 1) % imagesLength
    }

    // The headline is made of two lines ("One team." / "One method.") sitting right
    // after the image in the same flex column. Their finished position is whatever
    // the container's own CSS already lays out (flex row, nowrap, 7.25rem) — we
    // just measure how far each line sits from the image's top/bottom edge and
    // tween that distance back to 0, so they appear to start pinned to the image
    // and converge into the headline. Kept in normal flow the whole time (no
    // position/height juggling) so nothing collapses or gets clipped by the
    // section's overflow: hidden.
    const scrollerContainer = document.querySelector('.text-scroller-container'),
        scrollerImage = scrollerContainer.previousElementSibling,
        scrollerLines = gsap.utils.toArray('.text-scroller-container-main-text > div')

    const imageRect = scrollerImage.getBoundingClientRect(),
        lineStartY = scrollerLines.map((line, i) => {
            const lineRect = line.getBoundingClientRect()
            return i === 0
                ? imageRect.top - lineRect.top
                : imageRect.bottom - lineRect.bottom
        })


    // Text Scroller Timeline
    const textScrollerTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.text-scroller-container',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            pin: true,
            markers: true
        }
    }).fromTo(scrollerLines, {
        y: (i) => lineStartY[i],
    }, {
        y: 0,
        ease: 'none',
        duration: 1,
    }, 0).fromTo('.text-scroller-container', {
        fontSize: '2.5rem',
        lineHeight: '1.3',
        paddingTop: '7rem',
        paddingBottom: '7rem',
    }, {
        fontSize: '7.25rem',
        lineHeight: '1.2',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        duration: 1,
    }, 0);


    // Rotator: the circle has 4 fixed labels (Improve/Innovate/Inform/Inspire) and a
    // 4-dot navigator, so it needs to land exactly on 0/90/180/270deg in step with
    // whichever dot is active. Driving rotation straight off the scrub's own progress
    // (instead of firing separate, un-scrubbed tweens from onComplete callbacks) keeps
    // it perfectly in sync with scroll in both directions, with no extra handling
    // needed for entering/leaving the section.
    const rotatorSection = document.querySelector('.hp_rotator_section');
    const circle = document.querySelector('.hp_circle');
    const navigatorItems = gsap.utils.toArray('.circle_navigator_item');

    if (rotatorSection && circle) {
        gsap.timeline({
            scrollTrigger: {
                trigger: rotatorSection,
                start: 'top top',
                end: '+=400%',
                scrub: true,
                pin: true,
                onUpdate: (self) => {
                    const activeIndex = Math.min(
                        navigatorItems.length - 1,
                        Math.floor(self.progress * navigatorItems.length)
                    )
                    navigatorItems.forEach((item, i) => item.classList.toggle('active', i === activeIndex))
                },
            },
        }).to(circle, {
            rotation: 360,
            ease: `steps(${navigatorItems.length})`,
        });
    }


    // Grid Items Slide Down
    const stickyGridSection = document.querySelector('.hp_grid_sticky');
    const stickyGridItems = document.querySelectorAll('.hp_grid_sticky .grid_slide_down');

    if(stickyGridSection && stickyGridItems.length > 0) {
        gsap.to(stickyGridItems, {
            scrollTrigger: {
                trigger: stickyGridSection,
                start: 'top center',
                end: 'clamp(bottom top)',
                scrub: true,
            },
            yPercent: (i, target) => (i+1) * 42,
            // paddingTop: (i, target) => {
            //     const elHeight = parseFloat(getComputedStyle(target).offsetHeight);
            //     return (elHeight * 0.42);
            // },
            stagger: .025
        });
    }
}