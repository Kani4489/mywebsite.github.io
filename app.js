/**
 * Terranex Technologies - Application Script
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Mobile Menu & Navigation Scroll Effect
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Animated hamburger
        const bars = menuToggle.querySelectorAll('.bar');
        if (navMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = menuToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Sticky navbar with transition
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking on scroll
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 2. Hero Interactive Particle Canvas
    // ==========================================
    const heroCanvas = document.getElementById('hero-canvas');
    const heroCtx = heroCanvas.getContext('2d');

    let width = (heroCanvas.width = heroCanvas.offsetWidth);
    let height = (heroCanvas.height = heroCanvas.offsetHeight);

    const particles = [];
    const maxParticles = window.innerWidth < 768 ? 40 : 80;
    const connectionDist = 120;

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('resize', () => {
        width = (heroCanvas.width = heroCanvas.offsetWidth);
        height = (heroCanvas.height = heroCanvas.offsetHeight);
    });

    window.addEventListener('mousemove', (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary collision
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                }
            }
        }

        draw() {
            heroCtx.beginPath();
            heroCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            heroCtx.fillStyle = 'rgba(0, 240, 255, 0.7)';
            heroCtx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        heroCtx.clearRect(0, 0, width, height);

        // Grid lines drawing for high tech background feel
        heroCtx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        heroCtx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
            heroCtx.beginPath();
            heroCtx.moveTo(x, 0);
            heroCtx.lineTo(x, height);
            heroCtx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            heroCtx.beginPath();
            heroCtx.moveTo(0, y);
            heroCtx.lineTo(width, y);
            heroCtx.stroke();
        }

        // Connect particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const alpha = (connectionDist - dist) / connectionDist * 0.15;
                    heroCtx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    heroCtx.lineWidth = 0.8;
                    heroCtx.beginPath();
                    heroCtx.moveTo(particles[i].x, particles[i].y);
                    heroCtx.lineTo(particles[j].x, particles[j].y);
                    heroCtx.stroke();
                }
            }

            // Connect to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDist + 30) {
                    const alpha = (connectionDist + 30 - dist) / (connectionDist + 30) * 0.25;
                    heroCtx.strokeStyle = `rgba(5, 255, 196, ${alpha})`;
                    heroCtx.lineWidth = 1;
                    heroCtx.beginPath();
                    heroCtx.moveTo(particles[i].x, particles[i].y);
                    heroCtx.lineTo(mouse.x, mouse.y);
                    heroCtx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ==========================================
    // 3. Scroll Reveal System
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => observer.observe(el));


    // ==========================================
    // 4. Tabs Management (About Us)
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });


    // ==========================================
    // 5. White Background Removal (Canvas Processing)
    // ==========================================
    function removeWhiteBackground(imgElement) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Detect white and near-white pixels
                    if (r > 215 && g > 215 && b > 215) {
                        // Smooth alpha transition for edge anti-aliasing
                        const brightness = (r + g + b) / 3;
                        if (brightness > 245) {
                            data[i + 3] = 0; // Fully transparent
                        } else {
                            // Gradual fade for mid-range whites (edge pixels)
                            const alpha = Math.max(0, ((245 - brightness) / 30) * 255);
                            data[i + 3] = Math.min(data[i + 3], Math.round(alpha));
                        }
                    }
                }

                ctx.putImageData(imageData, 0, 0);

                try {
                    imgElement.src = canvas.toDataURL('image/png');
                } catch (e) {
                    // CORS issue fallback - keep original
                }
                resolve();
            };
            img.onerror = () => resolve();
            img.src = imgElement.src;
        });
    }

    // Process all product images after page loads
    function processProductImages() {
        const productImages = document.querySelectorAll('.showcase-product-img, .product-img');
        productImages.forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                removeWhiteBackground(img);
            } else {
                img.addEventListener('load', () => removeWhiteBackground(img), { once: true });
            }
        });
    }


    // ==========================================
    // 5b. Inline Product Showcase Rendering
    // ==========================================
    const allProducts = [
        // === Automatic Levels ===
        {
            name: 'Sokkia B Series Automatic Level (B20/B30/B40)',
            image: 'images/image1.png',
            desc: 'Field-proven precision automatic level featuring a highly reliable compensator and superior telescope focus.',
            category: 'automatic-levels',
            categoryLabel: 'Automatic Level',
            specs: [
                'Three magnification models: B20 (32x), B30 (28x), B40 (24x)',
                'Precise, field-proven compensator for accurate leveling',
                'Horizontal angle measurement with standard graduation',
                'Superior telescope with two-speed focus knob',
                'Quick collimation with two horizontal motion knobs'
            ],
            brochure: 'https://www.sokkia.com/sites/default/files/product/downloads/b20-b30-b40_brochure_sok-1025_reva_team_en_us_lores.pdf'
        },
        // === Robotic Total Stations ===
        {
            name: 'Sokkia iX-1500 / iX-700 Robotic Total Station',
            image: 'images/image2.png',
            desc: 'High-performance robotic total station featuring ultra-fast tracking technology for high precision layout.',
            category: 'robotic-total-stations',
            categoryLabel: 'Robotic Total Station',
            specs: [
                'UltraSonic motor drive with 180°/sec rotation speed',
                'UltraSlim body design with large color touch-screen display',
                'Integrated RC-5 remote control receiver unit',
                'Sokkia TSshield security and tracking cloud system',
                'Built-in Bluetooth and wireless communications interface'
            ],
            brochure: 'https://us.sokkia.com/sites/default/files/product/downloads/sokkia_ix-1500_700_sok-1055_engl25data_revc.pdf'
        },
        {
            name: 'Sokkia iX-1200 / iX-600 Robotic Total Station',
            image: 'images/image3.png',
            desc: 'Precision surveying motor total station offering advanced auto-tracking and layout capability.',
            category: 'robotic-total-stations',
            categoryLabel: 'Robotic Total Station',
            specs: [
                'High-reliability UltraSonic motors with direct drive system',
                'Dual-axis liquid tilt compensator mechanism',
                'Integrated reflectorless EDM measuring up to 800m',
                'Sokkia MAGNET Field on-board controller software',
                'Robust design with IP65 dust and water protection rating'
            ],
            brochure: 'https://us.sokkia.com/sites/default/files/product/downloads/sokkia_ix-series_sok-1056_engl25broc_reva.pdf'
        },
        {
            name: 'Leica FlexLine TS16 Robotic Total Station',
            image: 'images/image4.png',
            desc: 'Self-learning robotic total station that adapts dynamically to any environmental condition.',
            category: 'robotic-total-stations',
            categoryLabel: 'Robotic Total Station',
            specs: [
                'ARTrending intelligent target search and lock capability',
                'Dynamic Lock technology locks onto moving prisms automatically',
                'Integrated Leica Captivate field software with 3D views',
                'Laser guide pointer for rapid target coordinate alignment',
                'PinPoint EDM reflectorless range up to 1,000 meters'
            ],
            brochure: 'https://leica-geosystems.com/-/media/files/leicageosystems/products/datasheets/leica-ts16/leica%20ts16%20ds%20929657%201120%20en%20lr.pdf?sc_lang=en-in&hash=A006187B045D3BA8532EC8EC5706711E'
        },
        {
            name: 'Leica Nova TS60 MultiStation',
            image: 'images/image5.png',
            desc: "The world's most accurate total station, designed for the most demanding engineering projects.",
            category: 'robotic-total-stations',
            categoryLabel: 'Robotic Total Station',
            specs: [
                'Sub-millimeter angular accuracy (0.5" angular resolution)',
                'Dynamic Lock target tracking and ATRplus lock stability',
                'Integrated high-resolution telescope and wide-angle cameras',
                'Complete integration with Leica Captivate on-board software',
                'Engineered for highly precise structural monitoring tasks'
            ],
            brochure: 'https://leica-geosystems.com/-/media/files/leicageosystems/products/datasheets/leica_nova_ts60_ds.pdf?sc_lang=en-in&hash=662A41553D2B03258825CD33F09E0BB8'
        },
        {
            name: 'Leica Nova TM50 Monitoring Total Station',
            image: 'images/image6.png',
            desc: 'Automated structural monitoring sensor built for 24/7 continuous operation in harsh environments.',
            category: 'robotic-total-stations',
            categoryLabel: 'Robotic Total Station',
            specs: [
                'High-reliability direct piezo motor drives for silent rotation',
                'Dual-camera system featuring overview and telescope imaging',
                'Long-range EDM measuring up to 3,000m to standard prisms',
                'Robust design with full IP65 ingress protection rating',
                'Seamlessly integrated with Leica GeoMoS automated software'
            ],
            brochure: 'https://leica-geosystems.com/en-in/products/total-stations/robotic-total-stations/leica-nova-tm50'
        },
        // === Manual Total Stations ===
        {
            name: 'Sokkia iM-50 Series Manual Total Station',
            image: 'images/image7.png',
            desc: 'Compact and lightweight layout tool offering high quality surveying at an entry-level price.',
            category: 'manual-total-stations',
            categoryLabel: 'Manual Total Station',
            specs: [
                'Fast and accurate reflectorless EDM measuring up to 500m',
                'Dual-axis tilt compensation for precise leveling control',
                'High-capacity internal memory storing up to 50,000 points',
                'Up to 15 hours battery life for continuous field operation',
                'Waterproof design with IP66 rugged environmental rating'
            ],
            brochure: 'https://us.sokkia.com/sites/default/files/product/downloads/sokkia_im-50_brochure_sok_1046_reva_sm.pdf'
        },
        {
            name: 'Sokkia iM-100 Series Manual Total Station',
            image: 'images/image8.png',
            desc: 'Mid-range manual total station designed for high accuracy surveying and layout tasks.',
            category: 'manual-total-stations',
            categoryLabel: 'Manual Total Station',
            specs: [
                'Powerful EDM measuring up to 800m in reflectorless mode',
                'Integrated Bluetooth communications for data collector link',
                'Dual display panels with alphanumeric keyboard inputs',
                'Bi-directional dual-axis tilt compensator sensor',
                'MAGNET Field on-board software option for smart workflows'
            ],
            brochure: 'https://us.sokkia.com/sites/default/files/product/downloads/im-100series_broch_sok-1042_revb_team_en_us_lores.pdf'
        },
        {
            name: 'Sokkia FX Advanced Manual Total Station',
            image: 'images/image9.png',
            desc: 'Advanced manual total station featuring color touch screen and on-board software integration.',
            category: 'manual-total-stations',
            categoryLabel: 'Manual Total Station',
            specs: [
                'Windows CE operating system on-board console controller',
                'MAGNET Field data collection software pre-installed',
                'Long-range reflectorless EDM measuring up to 500m',
                'TSshield telemetry cloud support security system',
                'Built-in Bluetooth and flash storage card interfaces'
            ],
            brochure: 'https://us.sokkia.com/sites/default/files/product/downloads/fx-200_manualtotalstation_broch_sok-1052_reva_team_en_us_lores_2.pdf'
        },
        {
            name: 'Leica FlexLine TS10 Manual Total Station',
            image: 'images/image10.png',
            desc: 'High-end manual total station with a large color display and Leica Captivate field software.',
            category: 'manual-total-stations',
            categoryLabel: 'Manual Total Station',
            specs: [
                'Integrated Leica Captivate software with 3D viewer',
                'AutoHeight auto-sensor measures instrument height instantly',
                'Reflectorless range up to 1,000m with PinPoint EDM',
                'Large high-resolution color touchscreen interface panel',
                'Mobile data network module option for office synchronization'
            ],
            brochure: 'https://leica-geosystems.com/en-in/products/total-stations/manual-total-stations/leica-flexline-ts10'
        },
        {
            name: 'Leica FlexLine TS03 Manual Total Station',
            image: 'images/image11.png',
            desc: 'Classic manual total station designed for standard, high-reliability daily surveying tasks.',
            category: 'manual-total-stations',
            categoryLabel: 'Manual Total Station',
            specs: [
                'User-friendly Leica FlexField on-board workflow software',
                'Highly precise angular and distance measurements accuracy',
                'Reflectorless measurement range up to 500m with EDM',
                'Robust design with high resistance to water and dust',
                'Large internal memory storage for survey data points'
            ],
            brochure: 'https://leica-geosystems.com/en-in/products/total-stations/manual-total-stations/leica-flexline-ts03'
        },
        {
            name: 'Leica FlexLine TS07 Manual Total Station',
            image: 'images/image12.png',
            desc: 'Professional manual total station featuring AutoHeight and color touch screen capabilities.',
            category: 'manual-total-stations',
            categoryLabel: 'Manual Total Station',
            specs: [
                'AutoHeight auto-laser measurement of instrument height',
                'Leica FlexField software with intuitive menu layouts',
                'Full color touchscreen display console with keyboard',
                'PinPoint EDM reflectorless measuring range up to 1,000m',
                'Wireless connectivity option with built-in Bluetooth'
            ],
            brochure: 'https://leica-geosystems.com/-/media/files/leicageosystems/products/datasheets/leica%20flexline%20ts07%200221%20en-in%20lr.pdf?sc_lang=en-in&hash=1B27FF238DB1E23ACB2FB16E13246299'
        },
        {
            name: 'Leica TS01 Manual Total Station',
            image: 'images/image13.png',
            desc: 'Entry-level manual total station designed for construction layout and basic surveying.',
            category: 'manual-total-stations',
            categoryLabel: 'Manual Total Station',
            specs: [
                'Simple and intuitive keyboard interface design layout',
                'Fast and accurate distance measurements with EDM tracker',
                'Reflectorless measurement capability up to 500m',
                'Long operational battery life for full day assignments',
                'Rugged build quality certified for active worksites'
            ],
            brochure: 'https://leica-geosystems.com/en-in/products/total-stations/manual-total-stations/leica-ts01'
        },
        {
            name: 'Sokkia NET AXII 3D Monitoring Station',
            image: 'images/image14.png',
            desc: 'Ultra-precise 3D monitoring station designed for structural and engineering deformations monitoring.',
            category: 'manual-total-stations',
            categoryLabel: 'Monitoring Station',
            specs: [
                'Ultra-precise angular measurement (0.5" or 1" models)',
                'Auto-collimation tracking with intelligent target search',
                'Highly precise distance accuracy (0.5mm + 1ppm to prism)',
                'Reflectorless EDM optimized for structural scanning tasks',
                'IP65 dust and water ingress protection rating standard'
            ],
            brochure: 'https://us.sokkia.com/sites/default/files/product/downloads/net-axiiseries_3dmonitoringstations_broch_sok-1002_reve_team_en_us_lores.pdf'
        },
        {
            name: 'Leica Nova MS60 MultiStation',
            image: 'images/image15.png',
            desc: 'All-in-one scanning total station integrating 3D laser scanning, imaging, and GNSS.',
            category: 'manual-total-stations',
            categoryLabel: 'MultiStation',
            specs: [
                '3D laser scanning speeds up to 30,000 Hz frequencies',
                'Highly precise ATRplus automatic prism tracking system',
                'Integrated overview and telescope digital camera system',
                'Full integration with Leica Captivate 3D field apps',
                'Designed for rapid scanning, layout, and structural checks'
            ],
            brochure: 'https://leica-geosystems.com/products/total-stations/multistation/leica-nova-ms60'
        },
        // === Defense Components ===
        {
            name: 'Tactical GNSS & Inertial Navigation Module',
            image: 'images/image16.jpeg',
            desc: 'Rugged military-grade positioning module combining high-sensitivity multi-constellation GNSS with inertial sensors.',
            category: 'defense-components',
            categoryLabel: 'Defense System',
            specs: [
                'Tactical-grade MEMS IMU sensor integration',
                'Jamming and spoofing mitigation algorithms',
                'Dual-frequency L1/L2 multi-constellation support',
                'Ruggedized enclosure meeting MIL-STD-810H standards',
                'High-speed serial and Ethernet interface connections'
            ],
            brochure: '#contact'
        },
        {
            name: 'High-Reliability Defense Telemetry Unit',
            image: 'images/image17.jpeg',
            desc: 'Mission-critical data telemetry processor engineered for real-time sensor processing and strategic communications.',
            category: 'defense-components',
            categoryLabel: 'Defense System',
            specs: [
                'High-speed DSP processor core architecture',
                'Multiple analog and digital signal input channels',
                'Low latency data encoding and transmission protocols',
                'Operational temperature range of -40°C to +85°C',
                'EMI/EMC shielded enclosure for strategic systems'
            ],
            brochure: '#contact'
        },
        {
            name: 'Military Timing & Frequency Distribution Server',
            image: 'images/image18.jpeg',
            desc: 'Ultra-precise synchronization server distributing microsecond-accurate timing across defense networks.',
            category: 'defense-components',
            categoryLabel: 'Defense System',
            specs: [
                'Rubidium atomic frequency standard core reference',
                'NTP, PTP, IRIG-B, and PPS output synchronization interfaces',
                'High-stability holdover performance during GPS signal loss',
                'Dual-redundant power supply inputs configuration',
                'Designed for military communications and radar command grids'
            ],
            brochure: '#contact'
        },
        // === Auto-Steer Systems ===
        {
            name: 'FJD AT2 Auto-Steer System',
            image: 'images/image19.png',
            desc: 'Automated steering solution combining GNSS navigation with electric steering wheel control for tractors.',
            category: 'auto-steer-systems',
            categoryLabel: 'Auto-Steer',
            specs: [
                'High precision steering accuracy within +/- 2.5cm',
                'Easy installation on a wide range of tractor models',
                'Full steering automation reduces operator fatigue',
                'Touch screen display console showing live operations map',
                'Built-in terrain compensation sensor algorithms'
            ],
            brochure: 'https://agriculture.fjdynamics.com/products/fjd-at2-auto-steer-system'
        },
        {
            name: 'FJD AT2 Ultra Auto-Steer System',
            image: 'images/image20.png',
            desc: 'Ultra-precision agricultural guidance solution featuring RTK positioning and advanced path planning.',
            category: 'auto-steer-systems',
            categoryLabel: 'Auto-Steer',
            specs: [
                'Premium RTK positioning system accuracy',
                'Support for complex curved and spiral field paths',
                'Automatic headland turns capability automation',
                'Integrates with smart implements via ISOBUS interface',
                'Cloud platform link for digital farm job records'
            ],
            brochure: 'https://agriculture.fjdynamics.com/products/fjd-at2-auto-steer-system'
        },
        {
            name: 'FJD AT2 Max Auto-Steer System',
            image: 'images/image21.png',
            desc: 'Top-tier autosteer navigation kit designed for large-scale operations requiring maximum uptime.',
            category: 'auto-steer-systems',
            categoryLabel: 'Auto-Steer',
            specs: [
                'Dual-antenna RTK receiver setup for heading stability',
                'High-torque electric steering wheel motor',
                'Real-time visual monitoring via crop guidance camera',
                'Rugged hardware constructed for tough field environments',
                'Lifetime support for software updates and map tools'
            ],
            brochure: 'https://agriculture.fjdynamics.com/products/fjd-at2-max-auto-steer-system'
        },
        {
            name: 'FJD AT2 Lite Auto-Steer System',
            image: 'images/image22.png',
            desc: 'Entry-level guidance autosteer system for small farms looking to introduce smart farming.',
            category: 'auto-steer-systems',
            categoryLabel: 'Auto-Steer',
            specs: [
                'Sub-meter coordinate positioning accuracy guidance',
                'Simplified setup console wizard for fast deployment',
                'Manual driving assist modes with guidance lines',
                'Cost-effective system that saves seed, fuel, and time',
                'Option to upgrade easily to RTK accuracy later'
            ],
            brochure: 'https://agriculture.fjdynamics.com/products/fjd-at2-lite-auto-steer-system'
        },
        {
            name: 'FJD AT1 Autosteering Kit',
            image: 'images/image23.png',
            desc: 'Field-proven robust steering kit providing high reliability and coordinate lock on the path.',
            category: 'auto-steer-systems',
            categoryLabel: 'Auto-Steer',
            specs: [
                'High reliability hydraulic or electric steering options',
                'Maintains precise path accuracy even in dust and fog',
                'Intuitive control application interface layout',
                'Durable sensors designed for heavy duty machines',
                'Multi-language terminal guidance support options'
            ],
            brochure: 'https://agriculture.fjdynamics.com/products/fjd-at1-autosteering-kit'
        }
    ];

    // Render product cards into the showcase grid
    const showcaseGrid = document.getElementById('products-showcase-grid');

    function renderProductCard(product, index) {
        return `
            <div class="showcase-product-card scroll-reveal" data-category="${product.category}" style="animation-delay: ${index * 0.06}s">
                <div class="showcase-img-container">
                    <span class="showcase-category-badge">${product.categoryLabel}</span>
                    <img src="${product.image}" alt="${product.name}" class="showcase-product-img" loading="lazy" onerror="this.src='images/image1.png'">
                </div>
                <div class="showcase-product-info">
                    <h4 class="showcase-product-name">${product.name}</h4>
                    <p class="showcase-product-desc">${product.desc}</p>
                    <button class="specs-toggle-btn" aria-expanded="false">
                        <i class="fas fa-chevron-down"></i>
                        <span>View Specifications</span>
                    </button>
                    <div class="specs-collapsible">
                        <ul class="showcase-specs-list">
                            ${product.specs.map(spec => `
                                <li><i class="fas fa-circle-check"></i> <span>${spec}</span></li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <div class="showcase-product-actions">
                    <a href="${product.brochure}" target="_blank" class="showcase-brochure-btn">
                        <i class="fas fa-file-pdf"></i>
                        <span>${product.brochure === '#contact' ? 'Request Datasheet' : 'Download Brochure'}</span>
                    </a>
                </div>
            </div>
        `;
    }

    function renderAllProducts(filter = 'all') {
        const filtered = filter === 'all'
            ? allProducts
            : allProducts.filter(p => p.category === filter);

        showcaseGrid.innerHTML = filtered.map((p, i) => renderProductCard(p, i)).join('');

        // Re-observe scroll-reveal on new elements
        const newCards = showcaseGrid.querySelectorAll('.scroll-reveal');
        newCards.forEach(el => observer.observe(el));

        // Process images for background removal
        setTimeout(processProductImages, 100);

        // Re-bind specs toggles
        bindSpecsToggles();
    }

    // Initial render
    renderAllProducts();


    // ==========================================
    // 5c. Product Filter Tabs
    // ==========================================
    const filterTabs = document.querySelectorAll('.product-filter-btn');

    filterTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active tab
            filterTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Fade out existing cards
            const existingCards = showcaseGrid.querySelectorAll('.showcase-product-card');
            existingCards.forEach(card => card.classList.add('fade-out'));

            // After fade-out, re-render with new filter
            setTimeout(() => {
                renderAllProducts(filter);

                // Apply fade-in animation to new cards
                const newCards = showcaseGrid.querySelectorAll('.showcase-product-card');
                newCards.forEach((card, i) => {
                    card.style.animationDelay = `${i * 0.05}s`;
                    card.classList.add('fade-in');
                });
            }, 250);
        });
    });


    // ==========================================
    // 5d. Specs Toggle (Expand/Collapse)
    // ==========================================
    function bindSpecsToggles() {
        const toggleBtns = document.querySelectorAll('.specs-toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const collapsible = btn.nextElementSibling;
                const isExpanded = btn.classList.contains('expanded');

                if (isExpanded) {
                    btn.classList.remove('expanded');
                    collapsible.classList.remove('expanded');
                    btn.querySelector('span').textContent = 'View Specifications';
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    btn.classList.add('expanded');
                    collapsible.classList.add('expanded');
                    btn.querySelector('span').textContent = 'Hide Specifications';
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }


    // ==========================================
    // 5e. Modal (kept for Testing vertical only)
    // ==========================================
    const modal = document.getElementById('vertical-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-body-content');
    const verticalBtns = document.querySelectorAll('.vertical-explore-btn');

    // Non-product verticals data (testing only, since the bento card button remains)
    const nonProductData = {
        testing: {
            title: 'Defense Testing & Monitoring Products',
            desc: 'Drawing from extensive experience in industrial and defense environments, Terranex provides advanced testing, monitoring, and instrumentation solutions.',
            itemsTitle: 'Product Portfolio:',
            isNested: true,
            categories: [
                {
                    name: 'Environmental & Atmospheric Systems',
                    items: [
                        'Upper Air Sounding Systems',
                        'GPS Pilot Sondes',
                        'Radio Sondes',
                        'Automatic Weather Stations',
                        'Meteorological Monitoring Systems'
                    ]
                },
                {
                    name: 'Industrial Monitoring Solutions',
                    items: [
                        'Remote Monitoring Systems',
                        'Data Loggers',
                        'Process Monitoring Equipment',
                        'Signal Conditioning Systems',
                        'Industrial Communication Interfaces'
                    ]
                },
                {
                    name: 'Precision Timing & Synchronization',
                    items: [
                        'GPS/GLONASS Time Synchronization Systems',
                        'NTP Servers',
                        'PTP Servers',
                        'IRIG-B Solutions',
                        'Network Time Distribution Systems'
                    ]
                },
                {
                    name: 'Defense Test & Measurement',
                    items: [
                        'Signal Converters',
                        'Signal Isolators',
                        'Alarm Annunciators',
                        'GOOSE / DNP3 Communication Systems',
                        'Signal Receivers',
                        'Industrial Display Systems'
                    ]
                },
                {
                    name: 'Thermal Monitoring Systems',
                    items: [
                        'High Temperature Cameras',
                        'Furnace Monitoring Systems',
                        'Boiler Monitoring Solutions',
                        'Process Safety Monitoring'
                    ]
                }
            ]
        }
    };

    verticalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const verticalKey = btn.getAttribute('data-vertical');
            const data = nonProductData[verticalKey];

            if (data) {
                const modalWrapper = modal.querySelector('.modal-card');
                modalWrapper.classList.remove('modal-large');

                let itemsHtml = '';
                if (data.isNested) {
                    itemsHtml = data.categories.map(cat => `
                        <div class="modal-category" style="margin-bottom: 16px;">
                            <h4 class="modal-cat-title" style="color: var(--color-cyan); margin-top: 16px; margin-bottom: 8px; font-family: var(--font-heading); font-size: 0.95rem; border-left: 2px solid var(--color-cyan); padding-left: 8px; text-transform: uppercase; letter-spacing: 0.05em;">${cat.name}</h4>
                            <ul class="modal-list" style="grid-template-columns: 1fr; gap: 6px;">
                                ${cat.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('');
                }

                modalContent.innerHTML = `
                    <div class="modal-content-details" style="max-height: 75vh; overflow-y: auto; padding-right: 12px;">
                        <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">${data.title}</h3>
                        <p class="body-text" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">${data.desc}</p>
                        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; color: #ffffff; margin-bottom: 4px;">${data.itemsTitle}</h4>
                        ${itemsHtml}
                    </div>
                `;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modal
    const closeModalFunc = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModalFunc();
    });


    // ==========================================
    // 6. Interactive Command Center Dashboard
    // ==========================================
    const dashTabBtns = document.querySelectorAll('.dash-tab-btn');
    const simPanes = document.querySelectorAll('.sim-pane');

    // Tab switcher
    dashTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const simPaneId = 'sim-' + btn.getAttribute('data-sim');

            dashTabBtns.forEach(b => b.classList.remove('active'));
            simPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(simPaneId).classList.add('active');

            // Trigger canvas resizing/draw if switching to Satellite Orbit
            if (simPaneId === 'sim-satellite') {
                resizeSatCanvas();
            }
        });
    });

    // ------------------------------------------
    // A. Satellite Simulation Canvas
    // ------------------------------------------
    const satCanvas = document.getElementById('satellite-orbit-canvas');
    const satCtx = satCanvas.getContext('2d');

    // Satellites parameters
    let satWidth = 0;
    let satHeight = 0;
    let satAngle = 0;
    let constellationType = 'all';

    const satellitesData = {
        all: { count: 12, hdop: 0.82, label: 'Multi-Constellation (All)', sats: [] },
        gps: { count: 8, hdop: 1.15, label: 'GPS (USA)', sats: [] },
        navic: { count: 7, hdop: 1.05, label: 'NavIC (India)', sats: [] },
        galileo: { count: 6, hdop: 1.25, label: 'Galileo (Europe)', sats: [] }
    };

    function resizeSatCanvas() {
        if (!satCanvas.offsetParent) return; // Skip if hidden
        satWidth = satCanvas.width = satCanvas.parentElement.clientWidth;
        satHeight = satCanvas.height = satCanvas.parentElement.clientHeight || 300;
    }

    // Setup orbit positions
    function setupSats() {
        for (let type in satellitesData) {
            satellitesData[type].sats = [];
            for (let i = 0; i < satellitesData[type].count; i++) {
                satellitesData[type].sats.push({
                    orbitRadius: 70 + (i % 3) * 25,
                    speed: 0.005 + (i * 0.002),
                    phase: (i * (Math.PI * 2 / satellitesData[type].count)),
                    id: (type.toUpperCase() + '-' + (i + 100))
                });
            }
        }
    }
    setupSats();
    resizeSatCanvas();

    window.addEventListener('resize', resizeSatCanvas);

    // Switch Constellation
    const constSelect = document.getElementById('constellation-select');
    constSelect.addEventListener('change', (e) => {
        constellationType = e.target.value;
        const config = satellitesData[constellationType];

        document.getElementById('sat-count').textContent = config.count;
        document.getElementById('hdop-val').textContent = config.hdop.toFixed(2);

        // Color status based on DOP quality
        const hdopValEl = document.getElementById('hdop-val');
        if (config.hdop < 1.0) {
            hdopValEl.className = 'tel-value text-green';
        } else {
            hdopValEl.className = 'tel-value text-cyan';
        }
    });

    // Orbit Animation Loop
    function animateSatellites() {
        if (!satCanvas.offsetParent) {
            requestAnimationFrame(animateSatellites);
            return;
        }

        satCtx.clearRect(0, 0, satWidth, satHeight);

        const cx = satWidth / 2;
        const cy = satHeight / 2;

        // Draw Earth / Receiver Center
        satCtx.beginPath();
        satCtx.arc(cx, cy, 18, 0, Math.PI * 2);
        satCtx.fillStyle = '#101b35';
        satCtx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
        satCtx.lineWidth = 2;
        satCtx.fill();
        satCtx.stroke();

        // Draw Receiver Core Dot
        satCtx.beginPath();
        satCtx.arc(cx, cy, 4, 0, Math.PI * 2);
        satCtx.fillStyle = '#05ffc4';
        satCtx.fill();

        // Orbit paths (circular grids)
        satCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        satCtx.lineWidth = 1;
        [70, 95, 120].forEach(r => {
            satCtx.beginPath();
            satCtx.arc(cx, cy, r, 0, Math.PI * 2);
            satCtx.stroke();
        });

        // Get current satellites array
        const currentConfig = satellitesData[constellationType];

        satAngle += 0.01;

        currentConfig.sats.forEach(sat => {
            const angle = satAngle * sat.speed * 100 + sat.phase;
            const sx = cx + Math.cos(angle) * sat.orbitRadius;
            const sy = cy + Math.sin(angle) * sat.orbitRadius;

            // Draw Beam line from Sat to Earth Receiver
            satCtx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
            satCtx.lineWidth = 0.7;
            satCtx.beginPath();
            satCtx.moveTo(cx, cy);
            satCtx.lineTo(sx, sy);
            satCtx.stroke();

            // Draw Satellite Body
            satCtx.beginPath();
            satCtx.arc(sx, sy, 5, 0, Math.PI * 2);
            satCtx.fillStyle = '#00f0ff';
            satCtx.fill();

            // Satellite wings panel drawing representation
            satCtx.fillStyle = 'rgba(59, 130, 246, 0.7)';
            satCtx.fillRect(sx - 10, sy - 2, 4, 4);
            satCtx.fillRect(sx + 6, sy - 2, 4, 4);
        });

        // Slight Lat/Lon coordinates jitter to simulate live tracking calculations
        if (Math.random() < 0.15) {
            const latJitter = (Math.random() - 0.5) * 0.005;
            const lonJitter = (Math.random() - 0.5) * 0.005;

            // Just small display jitter values
            document.getElementById('lat-val').textContent = `12° 58' ${(23.15 + latJitter).toFixed(2)}" N`;
            document.getElementById('lon-val').textContent = `80° 14' ${(56.42 + lonJitter).toFixed(2)}" E`;
        }

        requestAnimationFrame(animateSatellites);
    }
    animateSatellites();

    // ------------------------------------------
    // B. PTP/NTP Clock Sync Simulation
    // ------------------------------------------
    const masterClockEl = document.getElementById('master-clock');
    const clockOffsetEl = document.getElementById('clock-offset');
    const logConsole = document.getElementById('timing-log-output');
    const resetDriftBtn = document.getElementById('reset-drift-btn');

    let ptpSyncLogs = [
        'INIT PTP stack core... SUCCESS',
        'BIND interface eth0 -> MULTICAST GROUP 224.0.1.129',
        'LISTENING for master clock sync packages...'
    ];

    function updateMasterClock() {
        const d = new Date();
        const hrs = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        const secs = String(d.getSeconds()).padStart(2, '0');
        const ms = String(d.getMilliseconds()).padStart(3, '0');
        const ns = String(Math.floor(Math.random() * 999999)).padStart(6, '0');

        masterClockEl.textContent = `${hrs}:${mins}:${secs}.${ms}${ns}`;

        // Jitter clock offset display
        const offset = Math.floor(Math.random() * 6) + 3; // 3 to 8 ns
        clockOffsetEl.textContent = `< ${offset} ns`;
    }
    setInterval(updateMasterClock, 20); // Sub-second clock ticks

    // Logger stream
    function addLogLine(text, type = '') {
        const d = new Date();
        const timestamp = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;

        const logLine = document.createElement('div');
        logLine.className = 'log-line';
        logLine.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="log-text ${type}">${text}</span>`;

        logConsole.appendChild(logLine);
        logConsole.scrollTop = logConsole.scrollHeight;

        // Limit log display list length
        while (logConsole.childElementCount > 30) {
            logConsole.removeChild(logConsole.firstChild);
        }
    }

    // Populate initial logs
    ptpSyncLogs.forEach(txt => addLogLine(txt));

    // Live log emitter loop
    const logMessages = [
        { text: 'PTP: Received Announce message from Grandmaster clock ID: 00:1E:08:FF:FE:24:D0:A2', type: '' },
        { text: 'PTP: Synchronization path delay measured: 1.24 µs', type: '' },
        { text: 'PTP: Delay_Req packet dispatched successfully', type: '' },
        { text: 'PTP: Received Delay_Resp from master clock', type: '' },
        { text: 'CLOCK SYNC: Offset adjusted by -4 ns, state -> LOCKED', type: 'success' },
        { text: 'NTP Server Pool: Transmitted NTP sync to Critical Grid Node (10.0.4.15)', type: '' },
        { text: 'CLOCK SYNC: Stability verified within +/- 2ns. Status -> NOMINAL', type: 'success' }
    ];

    let logIntervalIndex = 0;
    function emitLiveLogs() {
        if (!logConsole.offsetParent) return; // Emit logs only if element visible on screen
        const msg = logMessages[logIntervalIndex];
        addLogLine(msg.text, msg.type);
        logIntervalIndex = (logIntervalIndex + 1) % logMessages.length;
    }
    setInterval(emitLiveLogs, 3000);

    resetDriftBtn.addEventListener('click', () => {
        logConsole.innerHTML = '';
        addLogLine('System stats reset requested.', 'success');
        addLogLine('PTP Engine: Initializing calibration cycle...', '');
        addLogLine('PTP Engine: Locking local oscillator frequency...', '');
        addLogLine('CLOCK SYNC: Offset adjusted by 0 ns, status -> LOCKED', 'success');
    });

    // ------------------------------------------
    // C. Upper Air Atmospheric Sounding Sonde Simulation
    // ------------------------------------------
    const launchSondeBtn = document.getElementById('launch-sonde-btn');
    const balloonContainer = document.querySelector('.balloon-container');
    const sondeAltEl = document.getElementById('sonde-alt');
    const sondeTempEl = document.getElementById('sonde-temp');
    const sondePressEl = document.getElementById('sonde-press');
    const sondeHumEl = document.getElementById('sonde-hum');
    const sondeGpsEl = document.getElementById('sonde-gps');
    const progressFill = document.querySelector('.progress-fill');

    let sondeAltitude = 0;
    let sondeInterval = null;
    let sondeRunning = false;

    function resetSonde() {
        sondeAltitude = 0;
        balloonContainer.style.bottom = '20px';
        sondeAltEl.textContent = '0';
        sondeTempEl.textContent = '28.4 °C';
        sondePressEl.textContent = '1013.2 hPa';
        sondeHumEl.textContent = '68 %';
        progressFill.style.width = '100%';
        sondeGpsEl.textContent = 'LOCK (8 Satellites)';
        sondeGpsEl.className = 'tel-value text-purple';
    }

    function runSondeTelemetry() {
        if (sondeAltitude >= 18000) {
            clearInterval(sondeInterval);
            sondeRunning = false;
            launchSondeBtn.textContent = 'Launch Sonde';
            launchSondeBtn.disabled = false;
            addLogLine('ATMOSPHERIC: Sonde flight ceiling reached (18km). Parachute deployment triggered.', 'success');
            sondeGpsEl.textContent = 'BURST / DESCENDING';
            sondeGpsEl.className = 'tel-value text-cyan';
            return;
        }

        // Increment altitude
        sondeAltitude += 150;
        sondeAltEl.textContent = sondeAltitude;

        // Calculate values dynamically relative to altitude
        // 1. Temp drops at ~6.5°C per km
        const currentTemp = (28.4 - (sondeAltitude / 1000) * 6.5).toFixed(1);
        sondeTempEl.textContent = `${currentTemp} °C`;

        // 2. Pressure drops exponentially (approximation)
        const currentPress = (1013.2 * Math.exp(-sondeAltitude / 7000)).toFixed(1);
        sondePressEl.textContent = `${currentPress} hPa`;

        // 3. Humidity changes dynamically
        const currentHum = Math.max(10, Math.floor(68 - (sondeAltitude / 400) + Math.sin(sondeAltitude / 100) * 10));
        sondeHumEl.textContent = `${currentHum} %`;

        // Update graphic position in container
        // Map 0 - 18000m to 20px - 220px in container height
        const bottomOffset = 20 + (sondeAltitude / 18000) * 200;
        balloonContainer.style.bottom = `${bottomOffset}px`;

        // Sonde battery discharge
        const batteryPct = Math.max(10, Math.floor(100 - (sondeAltitude / 180)));
        progressFill.style.width = `${batteryPct}%`;
        progressFill.parentElement.previousElementSibling.textContent = `Sonde Battery: ${batteryPct}%`;
    }

    launchSondeBtn.addEventListener('click', () => {
        if (sondeRunning) return;

        resetSonde();
        sondeRunning = true;
        launchSondeBtn.textContent = 'Ascending...';
        launchSondeBtn.disabled = true;

        addLogLine('ATMOSPHERIC: Balloon release protocol initiated.', 'success');
        addLogLine('ATMOSPHERIC: Radiosonde telemetry stream ACTIVE -> 403 MHz', '');

        sondeInterval = setInterval(runSondeTelemetry, 100); // Fast simulation tick
    });


    // ==========================================
    // 7. Contact Form Submission & Validation
    // ==========================================
    const form = document.getElementById('contact-form');
    const successBox = document.getElementById('form-success');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const msgInput = document.getElementById('form-message');

        let isValid = true;

        // Validate Name
        if (!nameInput.value.trim()) {
            nameInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove('invalid');
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            emailInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove('invalid');
        }

        // Validate Message
        if (!msgInput.value.trim()) {
            msgInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            msgInput.parentElement.classList.remove('invalid');
        }

        if (isValid) {
            // Simulated secure encryption delay
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Encrypting & Sending...</span> <i class="fas fa-lock animate-pulse"></i>';

            setTimeout(() => {
                submitBtn.style.display = 'none';
                successBox.style.display = 'flex';

                // Form cleanup
                nameInput.value = '';
                emailInput.value = '';
                msgInput.value = '';

                // Print secure contact log in console widget
                addLogLine('SECURE LINK: Received encrypted inquiry payload from corporate interface.', 'success');
            }, 1200);
        }
    });

    // Instant validation listener updates on typing
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.value.trim()) {
                field.parentElement.classList.remove('invalid');
            }
        });
    });

});
