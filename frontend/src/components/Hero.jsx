import React from 'react'

const Hero = () => {
  return (
    <div className="hero pt-20 pb-20 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto">
        {/* Text Content */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome to <span className="text-primary">Autoria</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed px-4" style={{ color: 'var(--text-secondary)' }}>
            Find your dream car on Autoria - Kenya's premier car marketplace. Whether you're buying your first vehicle or selling to upgrade, we connect buyers and sellers across East Africa.
          </p>
        </div>


        {/* Hero Image */}
        <div className="flex justify-center">
          <div className="relative max-w-4xl">
            <img
              src="/hero.png"
              alt="Hero"
              className="w-full max-w-4xl h-auto object-contain transform hover:scale-105 transition-transform duration-500"
            />
            {/* Optional decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Cars Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">1,200+</div>
            <div className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Cars Sold</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Happy Buyers</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero