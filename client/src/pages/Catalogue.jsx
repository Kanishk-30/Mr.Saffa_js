"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react"

// Array of catalogue page images
const cataloguePages = [
  "/images/catalogue/page1.png",   // Cover
  "/images/catalogue/page2.png",
  "/images/catalogue/page3.png",
  "/images/catalogue/page4.png",
  "/images/catalogue/page5.png",
  "/images/catalogue/page6.png",
  "/images/catalogue/page7.png",
  "/images/catalogue/page8.png",
  "/images/catalogue/page9.png",
  "/images/catalogue/page10.png",
  "/images/catalogue/page11.png",
  "/images/catalogue/page12.png",
  "/images/catalogue/page13.png",
  "/images/catalogue/page14.png",
  "/images/catalogue/page15.png",
  "/images/catalogue/page16.png",
  "/images/catalogue/page17.png",
  "/images/catalogue/page18.png",
  "/images/catalogue/page19.png",
  "/images/catalogue/page20.png",   // Back cover
  // Add more pages as needed
]

const Catalogue = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [currentSpread, setCurrentSpread] = useState(0) // 0 = cover, 1 = pages 2-3, 2 = pages 4-5, etc.
  const [isFlipping, setIsFlipping] = useState(false)

  const totalSpreads = Math.ceil((cataloguePages.length - 1) / 2) // Exclude cover from spread calculation

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen || !isBookOpen || isFlipping) return

      switch (e.key) {
        case 'ArrowRight':
          nextPage()
          break
        case 'ArrowLeft':
          prevPage()
          break
        case 'Escape':
          closeCatalogue()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, isBookOpen, currentSpread, isFlipping])

  const openCatalogue = () => {
    setIsOpen(true)
  }

  const closeCatalogue = () => {
    setIsOpen(false)
    setIsBookOpen(false)
    setCurrentSpread(0)
  }

  const openBook = () => {
    setIsBookOpen(true)
    setCurrentSpread(1) // Start from first spread (pages 2-3)
  }

  const closeBook = () => {
    setIsBookOpen(false)
    setCurrentSpread(0)
  }

  const nextPage = () => {
    if (isFlipping) return

    if (currentSpread < totalSpreads) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  const prevPage = () => {
    if (isFlipping) return

    if (currentSpread > 1) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1)
        setIsFlipping(false)
      }, 300)
    } else if (currentSpread === 1) {
      closeBook()
    }
  }

  const getLeftPageIndex = () => {
    if (currentSpread === 0) return 0 // Cover
    return (currentSpread - 1) * 2 + 1
  }

  const getRightPageIndex = () => {
    if (currentSpread === 0) return null // Cover has no right page
    return (currentSpread - 1) * 2 + 2
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Digital Product Catalogue</h1>
          <p className="text-gray-600 mb-8">
            Browse our complete collection with smooth page transitions
          </p>
          <button
            onClick={openCatalogue}
            className="bg-gradient-to-r from-blue-600 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <BookOpen className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Open Catalogue
          </button>
        </div>

        {/* Catalogue preview */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {cataloguePages.slice(0, 8).map((src, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-lg shadow-md">
              <img
                src={src}
                alt={`Page ${idx + 1} preview`}
                className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                Page {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catalogue Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          {/* Close Button */}
          <button
            onClick={closeCatalogue}
            className="absolute top-6 right-6 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Book Container */}
          <div className="relative flex items-center justify-center">

            {!isBookOpen ? (
              // Closed Book Cover
              <div
                className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105"
                onClick={openBook}
              >
                <div className="relative">
                  <img
                    src={cataloguePages[0]}
                    alt="Catalogue Cover"
                    className="w-60 sm:w-72 md:w-80 h-64 sm:h-80 md:h-[500px] object-cover rounded-lg shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.4))'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4" />
                      <p className="font-bold text-xl">OPEN CATALOGUE</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Open Book Spread
              <div className="relative flex items-center justify-center">
                {/* Left Page */}
                <div
                  className={`relative transition-all duration-300 ${isFlipping ? 'transform scale-95 opacity-80' : 'transform scale-100 opacity-100'}`}
                  style={{ transformOrigin: 'right center' }}
                >
                  <img
                    src={cataloguePages[getLeftPageIndex()]}
                    alt={`Page ${getLeftPageIndex() + 1}`}
                    className="w-40 sm:w-56 md:w-64 lg:w-80 h-60 sm:h-80 md:h-96 lg:h-[500px] object-cover shadow-xl"
                    style={{
                      borderRadius: getRightPageIndex() && getRightPageIndex() < cataloguePages.length ? '8px 0 0 8px' : '8px',
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                    }}
                  />
                  {/* Only show right edge shadow when there's a right page */}
                  {getRightPageIndex() && getRightPageIndex() < cataloguePages.length && (
                    <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-r from-transparent to-black/10"></div>
                  )}
                </div>

                {/* Right Page */}
                {getRightPageIndex() && getRightPageIndex() < cataloguePages.length && (
                  <div
                    className={`relative transition-all duration-300 ${isFlipping ? 'transform scale-95 opacity-80' : 'transform scale-100 opacity-100'}`}
                    style={{ transformOrigin: 'left center' }}
                  >
                    <img
                      src={cataloguePages[getRightPageIndex()]}
                      alt={`Page ${getRightPageIndex() + 1}`}
                      className="w-40 sm:w-56 md:w-64 lg:w-80 h-60 sm:h-80 md:h-96 lg:h-[500px] object-cover shadow-xl"
                      style={{
                        borderRadius: '0 8px 8px 0',
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                      }}
                    />
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-l from-transparent to-black/10"></div>
                  </div>
                )}

                {/* Center Binding - FIXED: Only show when there are two pages */}
                {getRightPageIndex() && getRightPageIndex() < cataloguePages.length && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-60 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-b from-gray-400 to-gray-600 shadow-lg z-10"></div>
                )}
              </div>
            )}

            {/* Navigation Arrows */}
            {isBookOpen && (
              <>
                <button
                  onClick={prevPage}
                  disabled={currentSpread <= 1 || isFlipping}
                  className={`absolute left-2 sm:left-4 md:-left-16 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 shadow-lg opacity-60 hover:opacity-90 ${currentSpread <= 1 || isFlipping
                    ? 'bg-gray-400 cursor-not-allowed opacity-30'
                    : 'bg-white hover:bg-blue-50 hover:scale-110 active:scale-95'
                    }`}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={nextPage}
                  disabled={currentSpread >= totalSpreads || isFlipping}
                  className={`absolute right-2 sm:right-4 md:-right-16 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 shadow-lg opacity-60 hover:opacity-90 ${currentSpread >= totalSpreads || isFlipping
                      ? 'bg-gray-400 cursor-not-allowed opacity-30'
                      : 'bg-white hover:bg-red-50 hover:scale-110 active:scale-95'
                    }`}

                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {/* Page Indicator */}
          {isBookOpen && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {currentSpread === 1 ? '2-3' :
                    getRightPageIndex() && getRightPageIndex() < cataloguePages.length ?
                      ` ${getLeftPageIndex() + 1}-${getRightPageIndex() + 1}` :
                      `Page ${getLeftPageIndex() + 1}`} {/*of {cataloguePages.length}*/}
                </span>
                <button
                  onClick={closeBook}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  X
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 text-white text-sm opacity-75">
            <p>Use ← → arrow keys or buttons to navigate • Esc to close</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Catalogue
