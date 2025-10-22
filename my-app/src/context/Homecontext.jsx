import React, { createContext, useContext, useState, useEffect } from "react";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loading = document.getElementById("loading");
      if (loading) {
        loading.classList.add("fade-out");
        setTimeout(() => {
          loading.style.display = "none";
          setIsLoading(false);
        }, 500);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Navbar scroll behavior
  useEffect(() => {
    let lastScrollTop = 0;
    const navbar = document.getElementById("header");

    const onScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (navbar) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          navbar.classList.add("navbar-hidden");
        } else {
          navbar.classList.remove("navbar-hidden");
        }

        if (scrollTop > 100) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }

      lastScrollTop = scrollTop;

      // Parallax effect for hero section
      const hero = document.querySelector(".hero-background");
      if (hero) {
        hero.style.transform = `translateY(${scrollTop * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenuToggle) {
      mobileMenuToggle.classList.toggle("active");
    }
    if (navLinks) {
      navLinks.classList.toggle("active");
    }
  };

  useEffect(() => {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        const mobileMenuToggle = document.getElementById("mobileMenuToggle");
        const navLinks = document.querySelector(".nav-links");
        if (mobileMenuToggle) mobileMenuToggle.classList.remove("active");
        if (navLinks) navLinks.classList.remove("active");
      }
    };

    smoothScrollLinks.forEach((link) => {
      link.addEventListener("click", handleSmoothScroll);
    });

    return () => {
      smoothScrollLinks.forEach((link) => {
        link.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMouseEnter = function () {
      this.style.animationPlayState = "paused";
    };

    const handleMouseLeave = function () {
      this.style.animationPlayState = "running";
    };

    const funElements = document.querySelectorAll(".fun-element");
    funElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      funElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, []);

  useEffect(() => {
    const track = document.getElementById("testimonialTrack");
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  const changeSlide = (direction) => {
    setCurrentSlide((prev) => {
      let newSlide = prev + direction;
      if (newSlide >= 4) newSlide = 0;
      if (newSlide < 0) newSlide = 3;
      return newSlide;
    });
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const showDay = (dayNumber) => {
    setCurrentDay(dayNumber);
  };

  const value = {
    currentSlide,
    currentDay,
    isLoading,
    isMobileMenuOpen,
    changeSlide,
    goToSlide,
    showDay,
    toggleMobileMenu,
    setCurrentSlide,
    setCurrentDay,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

export default HomeContext