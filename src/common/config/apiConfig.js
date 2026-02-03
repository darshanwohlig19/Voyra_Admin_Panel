const baseUrl = process.env.REACT_APP_API_BASE_URL

const config = {
  // Auth APIs
  SIGNIN_API: baseUrl + '/api/auth/login',
  LOGOUT_API: baseUrl + '/api/auth/logout',

  // Hero Section API
  GET_HERO_SECTION: baseUrl + '/api/heroSection/getHeroSection',
  UPDATE_HERO_SECTION: baseUrl + '/api/heroSection/updateHeroSection',

  // Home APIs
  GET_CRAFTED_DESIGN: baseUrl + '/api/craftedDesign/getCraftedDesign',
  GET_CATEGORY_GALLERY: baseUrl + '/api/categoryGallery/getCategoryGallery',
  GET_BRAND_VALUE: baseUrl + '/api/brandValue/getBrandValue',
  GET_BRAND_PARTNER: baseUrl + '/api/brandPartner/getBrandPartner',
  GET_PORTFOLIO_GALLERY: baseUrl + '/api/portfolioGallery/getPortfolioGallery',

  // About APIs
  GET_STORY: baseUrl + '/api/storySection/getStory',
  GET_VISION: baseUrl + '/api/visionSection/getVisionSection',
  GET_TEAM: baseUrl + '/api/teamSection/getTeamSection',
  GET_CTA_SECTION: baseUrl + '/api/ctaSection/getCtaSection',

  // Celebrities APIs
  GET_CURRENT_LIMELIGHT:
    baseUrl + '/api/currentLimelightSection/getCurrentLimelight',
  GET_ARTIST_COLLECTION:
    baseUrl + '/api/artistCollectionSection/getArtistCollection',
  GET_STARDOM: baseUrl + '/api/stardomSection/getStardom',
  GET_CELEBRITY_CAROUSEL: baseUrl + '/api/celebrityCarouselSection/getCarousel',
  CREATE_CELEBRITY_CAROUSEL:
    baseUrl + '/api/celebrityCarouselSection/createCarousel',
  UPDATE_CELEBRITY_CAROUSEL:
    baseUrl + '/api/celebrityCarouselSection/updateCarousel',
  DELETE_CELEBRITY_CAROUSEL:
    baseUrl + '/api/celebrityCarouselSection/deleteCarousel',
  // Spotlight Section APIs
  GET_SPOTLIGHT: baseUrl + '/api/spotlightSection/getSpotlight',
  UPDATE_SPOTLIGHT_SECTION: baseUrl + '/api/spotlightSection/updateSpotlight',
  ADD_SPOTLIGHT_CELEBRITY: baseUrl + '/api/spotlightSection/addCelebrity',
  UPDATE_SPOTLIGHT_CELEBRITY: baseUrl + '/api/spotlightSection/updateCelebrity',
  DELETE_SPOTLIGHT_CELEBRITY: baseUrl + '/api/spotlightSection/deleteCelebrity',

  // Gallery APIs
  GET_GALLERY: baseUrl + '/api/snapshotGallery/getSnapshotGallery',

  // Testimonials APIs
  GET_TESTIMONIALS: baseUrl + '/api/testimonial/getTestimonial',
  CREATE_TESTIMONIAL: baseUrl + '/api/testimonial/createTestimonial',
  UPDATE_TESTIMONIAL_SECTION: baseUrl + '/api/testimonial/updateTestimonial',
  UPDATE_TESTIMONIAL_ITEM: baseUrl + '/api/testimonial/updateTestimonialItem',
  DELETE_TESTIMONIAL_ITEM: baseUrl + '/api/testimonial/deleteTestimonialItem',
  DELETE_TESTIMONIAL_IMAGE: baseUrl + '/api/testimonial/deleteTestimonialImage',

  // Blog APIs
  GET_BLOGS: baseUrl + '/api/blog/getBlog',
  CREATE_BLOG: baseUrl + '/api/blog/createBlog',
  UPDATE_BLOG_SECTION: baseUrl + '/api/blog/updateBlog',
  UPDATE_BLOG_ITEM: baseUrl + '/api/blog/updateBlogItem',
  DELETE_BLOG_ITEM: baseUrl + '/api/blog/deleteBlogItem',

  // Contact APIs
  GET_ADDRESS: baseUrl + '/api/address/getMapUrl',
  GET_COUNTRIES: baseUrl + '/api/country/getCountries',
  BULK_CREATE_COUNTRIES: baseUrl + '/api/country/bulkCreateCountries',
  DELETE_COUNTRY: baseUrl + '/api/country/deleteCountry',
  GET_BUDGETS: baseUrl + '/api/budget/getBudgets',
  BULK_CREATE_BUDGETS: baseUrl + '/api/budget/bulkCreateBudgets',
  DELETE_BUDGET: baseUrl + '/api/budget/deleteBudget',
  GET_EVENT_TYPES: baseUrl + '/api/eventType/getEventTypes',
  BULK_CREATE_EVENT_TYPES: baseUrl + '/api/eventType/bulkCreateEventTypes',
  DELETE_EVENT_TYPE: baseUrl + '/api/eventType/deleteEventType',
}

export default config
