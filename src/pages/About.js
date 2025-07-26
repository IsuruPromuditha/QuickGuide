import React, { useEffect, useRef } from 'react';
import { GiSriLanka } from 'react-icons/gi';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "../assets/about-carosel/image1.jpg";
import image2 from "../assets/about-carosel/image2.jpg";
import image3 from "../assets/about-carosel/image3.jpg";
import image4 from "../assets/about-carosel/image4.jpg";

const About = () => {
  const sliderRef = useRef(null);

  const carouselImages = [
    { src: image1, alt: "Sri Lankan culture 1" },
    { src: image2, alt: "Sri Lankan culture 2" },
    { src: image3, alt: "Sri Lankan culture 3" },
    { src: image4, alt: "Sri Lankan culture 4" },
  ].map((image) => ({
    ...image,
    src: image.src || "https://via.placeholder.com/800x400?text=Image+Not+Found",
  }));

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: (
      <div className="slick-next bg-primary text-white rounded-full p-1 sm:p-2 hover:bg-secondary">
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    ),
    prevArrow: (
      <div className="slick-prev bg-primary text-white rounded-full p-1 sm:p-2 hover:bg-secondary">
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    ),
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
        },
      },
    ],
  };

  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(0); 
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-8 transition-all duration-300">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            About QuickGuide Sri Lanka
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connecting travelers with trusted local tour guides for authentic,
            seamless, and memorable experiences in Sri Lanka.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="md:w-1/2">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              At QuickGuide Sri Lanka, we aim to revolutionize the way tourists
              explore Sri Lanka by bridging the gap between travelers and verified
              local tour guides. Our platform leverages cutting-edge technology,
              including real-time geo-tracking, multilingual communication, and a
              gamified ranking system, to ensure transparency, trust, and
              exceptional experiences.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <Slider
              {...carouselSettings}
              ref={sliderRef}
              className="rounded-lg shadow-lg w-full"
              aria-label="About QuickGuide Sri Lanka image carousel"
            >
              {carouselImages.map((image, index) => (
                <div key={index} className="px-1 sm:px-2">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-40 sm:h-64 object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/800x400?text=Image+Not+Found")
                    }
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary text-center mb-6">
            Why Choose QuickGuide?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
              <GiSriLanka className="text-3xl sm:text-4xl text-secondary mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
                Verified Guides
              </h3>
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Connect with certified local guides who are vetted for
                authenticity and expertise.
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
              <GiSriLanka className="text-3xl sm:text-4xl text-secondary mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
                Real-Time Tracking
              </h3>
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Find guides near you with real-time geo-tracking for a seamless
                experience.
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
              <GiSriLanka className="text-3xl sm:text-4xl text-secondary mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
                Multilingual Support
              </h3>
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Communicate effortlessly with integrated Google Translate
                features.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-6">
            Our Team
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            QuickGuide Sri Lanka was developed by a passionate team of innovators
            at the University of Bedfordshire, led by A.I.P. Jayasooriya under
            the supervision of Dr. Nipunika Vithana. We are committed to
            enhancing Sri Lanka’s tourism industry through technology and cultural
            appreciation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;