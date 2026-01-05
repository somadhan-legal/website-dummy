// Comprehensive Google Analytics 4 Tracking Library
// Measurement ID: G-YKEDCJ07E2

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Core tracking function
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// ==========================================
// PAGE & SECTION TRACKING
// ==========================================

export const trackPageView = (pageName: string, pageTitle?: string) => {
  trackEvent('page_view', {
    page_title: pageTitle || pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    custom_page_name: pageName
  });
};

export const trackSectionView = (sectionId: string, sectionName: string) => {
  trackEvent('section_view', {
    section_id: sectionId,
    section_name: sectionName,
    timestamp: new Date().toISOString()
  });
};

export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    depth_percentage: percentage,
    page_location: window.location.href
  });
};

// ==========================================
// WAITLIST FUNNEL TRACKING
// ==========================================

export const trackWaitlistOpen = (source?: string) => {
  trackEvent('waitlist_opened', {
    source: source || 'unknown',
    timestamp: new Date().toISOString()
  });
};

export const trackWaitlistStepView = (stepNumber: number, stepName: string) => {
  trackEvent('waitlist_step_view', {
    step_number: stepNumber,
    step_name: stepName
  });
};

export const trackWaitlistStepComplete = (stepNumber: number, stepName: string, data?: Record<string, any>) => {
  trackEvent('waitlist_step_complete', {
    step_number: stepNumber,
    step_name: stepName,
    ...data
  });
};

export const trackWaitlistFieldInteraction = (fieldName: string, action: 'focus' | 'blur' | 'change') => {
  trackEvent('waitlist_field_interaction', {
    field_name: fieldName,
    action: action
  });
};

export const trackWaitlistValidationError = (fieldName: string, errorType: string) => {
  trackEvent('waitlist_validation_error', {
    field_name: fieldName,
    error_type: errorType
  });
};

export const trackWaitlistSubmitAttempt = () => {
  trackEvent('waitlist_submit_attempt', {
    timestamp: new Date().toISOString()
  });
};

export const trackWaitlistSubmitSuccess = (data: {
  profession: string;
  servicesCount: number;
  heardFrom: string;
  hasPhone: boolean;
  hasFeedback: boolean;
}) => {
  trackEvent('waitlist_submit_success', {
    profession: data.profession,
    services_count: data.servicesCount,
    heard_from: data.heardFrom,
    has_phone: data.hasPhone,
    has_feedback: data.hasFeedback,
    timestamp: new Date().toISOString()
  });
  
  // Also track as conversion
  trackEvent('conversion', {
    conversion_type: 'waitlist_signup',
    value: 1
  });
};

export const trackWaitlistSubmitError = (errorType: string) => {
  trackEvent('waitlist_submit_error', {
    error_type: errorType,
    timestamp: new Date().toISOString()
  });
};

export const trackWaitlistClose = (lastStep: number, completed: boolean) => {
  trackEvent('waitlist_closed', {
    last_step: lastStep,
    completed: completed,
    abandonment: !completed
  });
};

// ==========================================
// NAVIGATION TRACKING
// ==========================================

export const trackNavClick = (linkName: string, destination: string) => {
  trackEvent('navigation_click', {
    link_name: linkName,
    destination: destination,
    nav_type: 'main_nav'
  });
};

export const trackMobileMenuOpen = () => {
  trackEvent('mobile_menu_opened', {
    device_type: 'mobile',
    timestamp: new Date().toISOString()
  });
};

export const trackMobileMenuClose = () => {
  trackEvent('mobile_menu_closed', {
    device_type: 'mobile'
  });
};

export const trackLogoClick = () => {
  trackEvent('logo_click', {
    location: 'navbar'
  });
};

// ==========================================
// CTA & BUTTON TRACKING
// ==========================================

export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location,
    timestamp: new Date().toISOString()
  });
};

export const trackJoinWaitlistClick = (location: string) => {
  trackEvent('join_waitlist_click', {
    location: location,
    timestamp: new Date().toISOString()
  });
};

export const trackContactClick = (method: 'email' | 'phone' | 'form', location: string) => {
  trackEvent('contact_click', {
    contact_method: method,
    location: location
  });
};

export const trackSocialClick = (platform: string) => {
  trackEvent('social_click', {
    platform: platform,
    location: 'footer'
  });
};

// ==========================================
// LANGUAGE & PREFERENCES
// ==========================================

export const trackLanguageChange = (fromLang: string, toLang: string) => {
  trackEvent('language_change', {
    from_language: fromLang,
    to_language: toLang,
    timestamp: new Date().toISOString()
  });
};

// ==========================================
// ENGAGEMENT TRACKING
// ==========================================

export const trackServiceCardHover = (serviceId: string, serviceName: string) => {
  trackEvent('service_card_hover', {
    service_id: serviceId,
    service_name: serviceName
  });
};

export const trackServiceCardExpand = (serviceId: string, serviceName: string) => {
  trackEvent('service_card_expand', {
    service_id: serviceId,
    service_name: serviceName,
    device_type: 'mobile'
  });
};

export const trackFAQExpand = (category: string, questionIndex: number) => {
  trackEvent('faq_expand', {
    category: category,
    question_index: questionIndex
  });
};

export const trackFAQCategoryChange = (category: string) => {
  trackEvent('faq_category_change', {
    category: category
  });
};

// ==========================================
// TIME ON PAGE TRACKING
// ==========================================

let pageLoadTime: number;

export const startTimeTracking = () => {
  pageLoadTime = Date.now();
};

export const trackTimeOnPage = () => {
  if (pageLoadTime) {
    const timeSpent = Math.round((Date.now() - pageLoadTime) / 1000);
    trackEvent('time_on_page', {
      seconds: timeSpent,
      minutes: Math.round(timeSpent / 60 * 100) / 100
    });
  }
};

// ==========================================
// ERROR TRACKING
// ==========================================

export const trackError = (errorType: string, errorMessage: string, componentName?: string) => {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    component: componentName || 'unknown',
    page_location: window.location.href
  });
};

// ==========================================
// BACK TO TOP TRACKING
// ==========================================

export const trackBackToTop = () => {
  trackEvent('back_to_top_click', {
    scroll_position: window.scrollY
  });
};

// ==========================================
// USER PROPERTIES (Set once per session)
// ==========================================

export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

export const initializeAnalytics = () => {
  // Start time tracking
  startTimeTracking();
  
  // Track initial page view
  trackPageView('home', 'Somadhan | Legal Support Platform');
  
  // Set user properties based on device
  setUserProperties({
    device_type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
    screen_width: window.innerWidth,
    screen_height: window.innerHeight,
    user_agent: navigator.userAgent,
    referrer: document.referrer || 'direct',
    landing_page: window.location.pathname
  });
  
  // Track time on page when user leaves
  window.addEventListener('beforeunload', trackTimeOnPage);
  
  // Track scroll depth
  let maxScroll = 0;
  const scrollMilestones = [25, 50, 75, 90, 100];
  const trackedMilestones = new Set<number>();
  
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    }
  });
};
