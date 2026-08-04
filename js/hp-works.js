export function homepageWorks() {
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
}