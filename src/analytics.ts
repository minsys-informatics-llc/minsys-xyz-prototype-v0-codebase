export const initAnalytics = () => {
  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];
  
  // Create Intersection Observer for section tracking
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        if (sectionId) {
          window.dataLayer.push({
            event: 'section_view',
            section: sectionId
          });
        }
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

  // Observe all semantic sections with IDs
  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section);
  });
};

// Add TypeScript declaration for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
