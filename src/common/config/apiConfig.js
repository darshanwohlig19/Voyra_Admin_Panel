const baseUrl = process.env.REACT_APP_API_BASE_URL

const config = {
  // Auth APIs
  SIGNIN_API: baseUrl + '/api/auth/login',
  LOGOUT_API: baseUrl + '/api/auth/logout',

  // Home APIs

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

  // Gallery APIs
  GET_GALLERY: baseUrl + '/api/snapshotGallery/getSnapshotGallery',

  // Testimonials APIs
  GET_TESTIMONIALS: baseUrl + '/api/testimonial/getTestimonial',

  // Blog APIs
  GET_BLOGS: baseUrl + '/api/blog/getBlog',

  // Contact APIs
}

export default config
