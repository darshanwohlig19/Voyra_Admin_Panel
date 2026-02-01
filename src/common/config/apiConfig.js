const baseUrl = process.env.REACT_APP_API_BASE_URL

const config = {
  // Auth APIs
  SIGNIN_API: baseUrl + '/api/auth/login',
  LOGOUT_API: baseUrl + '/api/auth/logout',

  // Home APIs

  // About APIs

  // Celebrities APIs

  // Gallery APIs
  GET_GALLERY: baseUrl + '/api/snapshotGallery/getSnapshotGallery',

  // Testimonials APIs
  GET_TESTIMONIALS: baseUrl + '/api/testimonial/getTestimonial',

  // Blog APIs
  GET_BLOGS: baseUrl + '/api/blog/getBlog',

  // Contact APIs
}

export default config
