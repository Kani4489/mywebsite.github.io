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
    // 5. Bento Card Details Modal Expansion
    // ==========================================
    const modal = document.getElementById('vertical-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-body-content');
    const verticalBtns = document.querySelectorAll('.vertical-explore-btn');

    // Capabilities content registry matching Websitecontent.txt
    const capabilitiesData = {
        geospatial: {
            title: 'Geospatial Solutions',
            desc: 'Terranex delivers advanced geospatial technologies that enable precise positioning, mapping, surveying, and location intelligence for government, infrastructure, agriculture, mining, and utility sectors.',
            itemsTitle: 'Solutions Include:',
            isNested: false,
            items: [
                'GNSS Receivers',
                'RTK Systems',
                'DGPS Solutions',
                'Survey Equipment',
                'GIS Integration',
                'Mobile Mapping Solutions',
                'Drone Survey Solutions',
                'CORS Infrastructure',
                'Land Records Modernization Solutions',
                'Precision Agriculture Technologies',
                'Utility Mapping & Asset Management'
            ]
        },
        defense: {
            title: 'Defense & Aerospace Technologies',
            desc: 'We provide mission-critical technologies and specialized engineering solutions that support defense, aerospace, homeland security, and strategic infrastructure applications.',
            itemsTitle: 'Capabilities:',
            isNested: false,
            items: [
                'Defense Electronics',
                'Timing & Synchronization Systems',
                'Navigation Solutions',
                'Tactical Communication Support Systems',
                'Sensor Integration',
                'Ground Control Systems',
                'Military Grade Positioning Solutions',
                'Test & Measurement Systems',
                'Mission-Critical Monitoring Systems'
            ]
        },
        pnt: {
            title: 'Positioning, Navigation & Timing (PNT)',
            desc: 'Accurate Positioning, Navigation, and Timing form the backbone of modern defense and infrastructure systems.',
            itemsTitle: 'Offerings:',
            isNested: true,
            categories: [
                {
                    name: 'Multi-Constellation GNSS Solutions',
                    items: [
                        'GPS / GLONASS / Galileo / BeiDou Systems'
                    ]
                },
                {
                    name: 'Precision Timing Solutions',
                    items: [
                        'NTP/PTP Time Synchronization',
                        'Timing Servers',
                        'Frequency Standards',
                        'Network Synchronization Solutions',
                        'Critical Infrastructure Timing Systems'
                    ]
                }
            ]
        },
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
            const data = capabilitiesData[verticalKey];

            if (data) {
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
                } else {
                    itemsHtml = `
                        <ul class="modal-list" style="margin-top: 12px;">
                            ${data.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    `;
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
                document.body.style.overflow = 'hidden'; // Lock body scroll
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
        const currentHum = Math.max(10, Math.floor(68 - (sondeAltitude / 400) + Math.sin(sondeAltitude/100)*10));
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
