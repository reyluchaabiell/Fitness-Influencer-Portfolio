 const header = document.querySelector('.site-header');
      const toggle = document.querySelector('.mobile-toggle');
      const mobilePanel = document.querySelector('.mobile-panel');
      const desktopLinks = document.querySelectorAll('.nav-link');
      const mobileLinks = document.querySelectorAll('.mobile-link');
      const allLinks = [...desktopLinks, ...mobileLinks];
      const revealItems = document.querySelectorAll('.reveal-up');
      const heroVisual = document.getElementById('heroVisual');
      const pageSections = document.querySelectorAll('main section[id]');
      const dataSection = document.getElementById('section-2');
      const counters = dataSection ? dataSection.querySelectorAll('.count-up') : [];
      const ringCards = dataSection ? dataSection.querySelectorAll('.ring-card[data-progress]') : [];
      const animatedCounters = new WeakSet();
      const activatedRings = new WeakSet();
      const journeyStages = document.querySelectorAll('.journey-stage');
      const journeyContextTag = document.getElementById('journeyContextTag');
      const journeyContextTitle = document.getElementById('journeyContextTitle');
      const journeyContextText = document.getElementById('journeyContextText');
      const gallerySpotlight = document.getElementById('gallerySpotlight');
      const galleryBadge = document.getElementById('galleryBadge');
      const galleryKicker = document.getElementById('galleryKicker');
      const galleryTitle = document.getElementById('galleryTitle');
      const galleryDescription = document.getElementById('galleryDescription');
      const galleryMetaOne = document.getElementById('galleryMetaOne');
      const galleryMetaTwo = document.getElementById('galleryMetaTwo');
      const galleryMetaThree = document.getElementById('galleryMetaThree');
      const galleryModes = document.querySelectorAll('.gallery-mode');
      const galleryThumbs = document.querySelectorAll('.gallery-thumb');
      const serviceOptions = document.querySelectorAll('.service-option');
      const serviceBadge = document.getElementById('serviceBadge');
      const serviceTitle = document.getElementById('serviceTitle');
      const servicePill = document.getElementById('servicePill');
      const serviceDescription = document.getElementById('serviceDescription');
      const servicePointOne = document.getElementById('servicePointOne');
      const servicePointTwo = document.getElementById('servicePointTwo');
      const servicePointThree = document.getElementById('servicePointThree');
      const valueFilters = document.querySelectorAll('.value-filter');
      const valuesBadge = document.getElementById('valuesBadge');
      const valuesTitle = document.getElementById('valuesTitle');
      const valuesDescription = document.getElementById('valuesDescription');
      const valuesPointOne = document.getElementById('valuesPointOne');
      const valuesPointTwo = document.getElementById('valuesPointTwo');
      const valuesPointThree = document.getElementById('valuesPointThree');

      const setActive = (href) => {
        allLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === href);
        });
      };

      const closeMenu = () => {
        toggle.setAttribute('aria-expanded', 'false');
        mobilePanel.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      };

      const animateCounter = (element) => {
        if (animatedCounters.has(element)) return;
        animatedCounters.add(element);

        const target = Number(element.dataset.target || 0);
        const decimals = Number(element.dataset.decimals || 0);
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = 1300;
        const start = performance.now();

        const formatValue = (value) => {
          const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
          return `${prefix}${formatted}${suffix}`;
        };

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          element.textContent = formatValue(current);

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            element.textContent = formatValue(target);
          }
        };

        requestAnimationFrame(tick);
      };

      const activateRing = (card) => {
        if (activatedRings.has(card)) return;
        activatedRings.add(card);

        const fill = card.querySelector('.ring-fill');
        const progress = Number(card.dataset.progress || 0);
        if (!fill) return;

        const radius = fill.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        fill.style.strokeDasharray = `${circumference}`;
        fill.style.strokeDashoffset = `${circumference}`;

        requestAnimationFrame(() => {
          const offset = circumference - (circumference * progress) / 100;
          fill.style.strokeDashoffset = `${offset}`;
        });
      };

      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        mobilePanel.classList.toggle('is-open', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
      });

      allLinks.forEach((link) => {
        link.addEventListener('click', () => {
          setActive(link.getAttribute('href'));
          if (window.innerWidth <= 1040) closeMenu();
        });
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 1040) closeMenu();
      });

      const handleHeaderState = () => {
        header.classList.toggle('scrolled', window.scrollY > 10);

        let currentSection = '#section-1';
        pageSections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.35) {
            currentSection = `#${section.id}`;
          }
        });
        setActive(currentSection);
      };

      window.addEventListener('scroll', handleHeaderState);
      handleHeaderState();

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );

      revealItems.forEach((item) => revealObserver.observe(item));

      if (dataSection) {
        const dataObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              counters.forEach((counter) => animateCounter(counter));
              ringCards.forEach((card) => activateRing(card));
              dataSection.querySelectorAll('.views-bar').forEach((bar) => bar.classList.add('is-visible'));
              dataObserver.unobserve(entry.target);
            });
          },
          { threshold: 0.28 }
        );

        dataObserver.observe(dataSection);
      }

      const hasFinePointer = window.matchMedia('(pointer:fine)').matches;

      if (heroVisual && hasFinePointer && window.innerWidth > 1040) {
        heroVisual.addEventListener('mousemove', (event) => {
          const rect = heroVisual.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const rotateY = ((x / rect.width) - 0.5) * 10;
          const rotateX = ((y / rect.height) - 0.5) * -10;
          heroVisual.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
          heroVisual.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
      }

      if (journeyStages.length && journeyContextTag && journeyContextTitle && journeyContextText) {
        const setJourneyStage = (stage) => {
          journeyStages.forEach((item) => {
            const isActive = item === stage;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-pressed', String(isActive));
          });

          journeyContextTag.textContent = stage.dataset.tag || '';
          journeyContextTitle.textContent = stage.dataset.title || '';
          journeyContextText.textContent = stage.dataset.text || '';
        };

        journeyStages.forEach((stage) => {
          stage.addEventListener('click', () => setJourneyStage(stage));
          if (hasFinePointer) {
            stage.addEventListener('mouseenter', () => setJourneyStage(stage));
          }
        });

        setJourneyStage(journeyStages[0]);
      }

      if (gallerySpotlight && galleryBadge && galleryKicker && galleryTitle && galleryDescription && galleryMetaOne && galleryMetaTwo && galleryMetaThree) {
        const setGalleryMode = (source) => {
          const mode = source.dataset.mode || 'cinematic';
          gallerySpotlight.dataset.mode = mode;
          galleryBadge.textContent = source.dataset.kicker || '';
          galleryKicker.textContent = source.dataset.kicker || '';
          galleryTitle.textContent = source.dataset.title || '';
          galleryDescription.textContent = source.dataset.description || '';
          galleryMetaOne.textContent = source.dataset.metaOne || '';
          galleryMetaTwo.textContent = source.dataset.metaTwo || '';
          galleryMetaThree.textContent = source.dataset.metaThree || '';

          galleryModes.forEach((item) => item.classList.toggle('is-active', item.dataset.mode === mode));
          galleryThumbs.forEach((item) => item.classList.toggle('is-active', item.dataset.mode === mode));
        };

        [...galleryModes, ...galleryThumbs].forEach((item) => {
          item.addEventListener('click', () => setGalleryMode(item));
          if (hasFinePointer) {
            item.addEventListener('mouseenter', () => setGalleryMode(item));
          }
        });

        const initialGallerySource = document.querySelector('.gallery-mode.is-active') || galleryModes[0] || galleryThumbs[0];
        if (initialGallerySource) setGalleryMode(initialGallerySource);
      }

      if (serviceOptions.length && serviceBadge && serviceTitle && servicePill && serviceDescription && servicePointOne && servicePointTwo && servicePointThree) {
        const setServiceOption = (source) => {
          serviceBadge.textContent = source.dataset.badge || '';
          serviceTitle.textContent = source.dataset.title || '';
          servicePill.textContent = source.dataset.pill || '';
          serviceDescription.textContent = source.dataset.description || '';
          servicePointOne.textContent = source.dataset.pointOne || '';
          servicePointTwo.textContent = source.dataset.pointTwo || '';
          servicePointThree.textContent = source.dataset.pointThree || '';

          serviceOptions.forEach((item) => item.classList.toggle('is-active', item === source));
        };

        serviceOptions.forEach((item) => {
          item.addEventListener('click', () => setServiceOption(item));
          if (hasFinePointer) {
            item.addEventListener('mouseenter', () => setServiceOption(item));
          }
        });

        setServiceOption(serviceOptions[0]);
      }

      if (valueFilters.length && valuesBadge && valuesTitle && valuesDescription && valuesPointOne && valuesPointTwo && valuesPointThree) {
        const setValueFilter = (source) => {
          valuesBadge.textContent = source.dataset.badge || '';
          valuesTitle.textContent = source.dataset.title || '';
          valuesDescription.textContent = source.dataset.description || '';
          valuesPointOne.textContent = source.dataset.pointOne || '';
          valuesPointTwo.textContent = source.dataset.pointTwo || '';
          valuesPointThree.textContent = source.dataset.pointThree || '';

          valueFilters.forEach((item) => item.classList.toggle('is-active', item === source));
        };

        valueFilters.forEach((item) => {
          item.addEventListener('click', () => setValueFilter(item));
          if (hasFinePointer) {
            item.addEventListener('mouseenter', () => setValueFilter(item));
          }
        });

        setValueFilter(valueFilters[0]);
      }

// kode header
// kode hero
// kode section 2
// kode section 3
// kode section 4
// kode section 5
// kode section 6

// FOOTER
  const footerYear = document.getElementById("footerYear");
  const copyFooterEmail = document.getElementById("copyFooterEmail");
  const footerCopyStatus = document.getElementById("footerCopyStatus");
  const footerRevealItems = document.querySelectorAll(".site-footer .reveal-up");
  const footerQuickLinks = document.querySelectorAll('.site-footer .footer-link[href^="#section-"]');
  const footerSections = document.querySelectorAll("main section[id]");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  if (copyFooterEmail && footerCopyStatus) {
    copyFooterEmail.addEventListener("click", async () => {
      const email = copyFooterEmail.dataset.email || "partnerships@cbumlegacy.com";

      try {
        await navigator.clipboard.writeText(email);
        footerCopyStatus.textContent = "Email copied.";
      } catch (error) {
        footerCopyStatus.textContent = email;
      }

      footerCopyStatus.classList.add("is-visible");

      clearTimeout(copyFooterEmail._statusTimer);
      copyFooterEmail._statusTimer = setTimeout(() => {
        footerCopyStatus.classList.remove("is-visible");
      }, 2200);
    });
  }

  if (footerRevealItems.length) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          footerObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    footerRevealItems.forEach((item) => footerObserver.observe(item));
  }

  const setFooterActiveLink = () => {
    let activeId = "#section-1";

        footerSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const triggerLine = window.innerHeight * 0.35;

    if (rect.top <= triggerLine && rect.bottom > triggerLine) {
        activeId = `#${section.id}`;
    }
    });

    footerQuickLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === activeId;
      link.style.borderColor = isActive
        ? "rgba(201, 162, 74, 0.24)"
        : "rgba(255, 255, 255, 0.08)";
      link.style.background = isActive
        ? "rgba(201, 162, 74, 0.10)"
        : "rgba(255, 255, 255, 0.02)";
    });
  };

    if (footerQuickLinks.length && footerSections.length) {
    window.addEventListener("scroll", setFooterActiveLink, { passive: true });
    setFooterActiveLink();
    }