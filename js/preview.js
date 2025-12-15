/* ===========================================
   PREVIEW
   Resume preview generation
   =========================================== */

// Inline SVG data URIs to avoid external image loads (prevents canvas taint during PDF export)
const ICONS = {
  address: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0Z'/><circle cx='12' cy='10' r='3'/></svg>",
  email: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='m3 7 9 6 9-6'/></svg>",
  phone: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.1 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z'/></svg>",
  linkedin: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z'/><rect x='2' y='9' width='4' height='12'/><circle cx='4' cy='4' r='2'/></svg>",
}

const DEFAULT_TIMELINE_IMAGES = {
  bullet: "data:image/png;base64,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",
  dash: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARYAAAF3CAYAAABg5WSwAAAb6UlEQVR4nGJkGAUDBv7///+fHnYzMjKOxvMooB9gYGAAAAAA//9iGg3uUTAKRgFVAQMDAwAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//xotWEbBKBgF1AUMDAwAAAAA//8aLVhGwSgYBdQFDAwMAAAAAP//Gi1YRsEoGAXUBQwMDAAAAAD//wMAJhgG7o35J3wAAAAASUVORK5CYII="
}

function getTimelineImages() {
  return {
    bullet: state.timelineImages.bullet || DEFAULT_TIMELINE_IMAGES.bullet,
    dash: state.timelineImages.dash || DEFAULT_TIMELINE_IMAGES.dash,
  }
}

function nl2br(text) {
  if (!text) return ""
  return text.replace(/\n/g, "</br>")
}

/**
 * Update the Resume preview
 */
function updatePreview() {
  const preview = document.getElementById("resumePreview")
  const lang = state.language
  const t = translations[lang]

  // Determine colors for column 2
  const col2Bg = state.sameColors ? state.colors.col1Bg : state.colors.col2Bg
  const col2Text = state.sameColors ? state.colors.col1Text : state.colors.col2Text

  // Get font sizes
  const sectionTitleSize = getFontSize("sectionTitle")
  const subsectionTitleSize = getFontSize("subsectionTitle")
  const labelSize = getFontSize("label")
  const descriptionSize = getFontSize("description")
  const skillNameSize = getFontSize("skillName")
  const interestLabelSize = getFontSize("interestLabel")
  const interestDescSize = getFontSize("interestDesc")
  const introSize = getFontSize("intro")

  // Icon sizes also scale
  const skillIconSize = getIconSize(20)
  const interestIconSize = getIconSize(40)

  // Build sections
  const headerHTML = buildHeader()
  const introHTML = buildIntro(introSize)
  const skillsHTML = buildSkills(sectionTitleSize, subsectionTitleSize, skillNameSize, skillIconSize, t)
  const interestsHTML = buildInterests(sectionTitleSize, interestLabelSize, interestDescSize, interestIconSize, t)
  const educationHTML = buildEducations(sectionTitleSize, labelSize, descriptionSize, t)
  const experienceHTML = buildExperiences(sectionTitleSize, labelSize, descriptionSize, t)
  const footerHTML = buildFooter(t)

  // Separator line
  const separatorHTML = state.sameColors
    ? `<div class="resume-separator" style="left: ${state.columnBalance}%; background-color: ${state.colors.col1Text};"></div>`
    : ""

  // Page limit indicator
  const pageLimitIndicator = `
        <div class="resume-page-limit-line"></div>
        <div class="resume-page-limit-label">Page limit (A4)</div>
        <div class="resume-overflow-indicator"></div>
    `

  // Combine everything
  preview.innerHTML = `
        ${headerHTML}
        ${introHTML}
        <div class="resume-body" style="background-color: ${state.colors.col1Bg};">
            <div class="resume-left" style="width: ${state.columnBalance}%; color: ${state.colors.col1Text};">
                ${skillsHTML}
                ${interestsHTML}
            </div>
            <div class="resume-right" style="width: ${100 - state.columnBalance}%; background-color: ${col2Bg}; color: ${col2Text};">
                ${educationHTML}
                ${experienceHTML}
            </div>
            ${separatorHTML}
        </div>
        ${footerHTML}
        ${pageLimitIndicator}
    `

  // Adjust timeline lines after DOM update
  requestAnimationFrame(() => {
    adjustTimelineLines()
  })
}

/**
 * Build header HTML
 */
function buildHeader() {
  const hasContactInfo = state.email || state.phone || state.address || state.linkedin
  const linkedInDisplay = state.linkedin ? state.linkedin.replace(/^https?:\/\//, "") : ""

  if (state.firstName || state.lastName || state.jobTitle || hasContactInfo) {
    return `
            <div class="resume-header" style="background-color: ${state.colors.headerBg}; color: ${state.colors.headerText};">
                <div class="resume-header-left">
                    ${state.firstName || state.lastName ? `<h1>${state.firstName} ${state.lastName}</h1>` : ""}
                    ${state.jobTitle ? `<h2>${state.jobTitle}</h2>` : ""}
                </div>
                ${hasContactInfo
        ? `
                    <div class="resume-header-right">
                        ${state.address ? `<div><img src="${ICONS.address}" class="header-icon" alt=""><span>${state.address}</span></div>` : ""}
                        ${state.email ? `<div><img src="${ICONS.email}" class="header-icon" alt=""><span>${state.email}</span></div>` : ""}
                        ${state.phone ? `<div><img src="${ICONS.phone}" class="header-icon" alt=""><span>${state.phone}</span></div>` : ""}
                        ${state.linkedin ? `<div><img src="${ICONS.linkedin}" class="header-icon" alt=""><a href="${state.linkedin}" target="_blank" rel="noopener noreferrer"><span>${linkedInDisplay}</span></a></div>` : ""}
                    </div>
                `
        : ""
      }
            </div>
        `
  }
  return ""
}

/**
 * Build intro HTML
 */
function buildIntro(introSize) {
  return state.introduction
    ? `
        <div class="resume-intro centered-export" style="background-color: ${state.colors.introBg}; color: ${state.colors.introText}; font-size: ${introSize}px;">${nl2br(state.introduction)}</div>
    `
    : ""
}

/**
 * Build skills HTML
 */
function buildSkills(sectionTitleSize, subsectionTitleSize, skillNameSize, skillIconSize, t) {
  const visibleSkills = state.skills.filter((g) => g.visible && (g.title || g.items.some((i) => i.visible && i.name)))

  if (visibleSkills.length === 0) return ""

  const skillGroups = visibleSkills
    .map((group) => {
      const items = group.items
        .filter((item) => item.visible && item.name)
        .map((item) => {
          const icons = item.icons
            .map(
              (iconData) =>
                `<img src="${iconData}" style="width: ${skillIconSize}px; height: ${skillIconSize}px; border-radius: 2px; object-fit: contain;" alt="">`,
            )
            .join("")

          return `
                <div class="skill-item-display" style="font-size: ${skillNameSize}px;">
                    ${icons ? `<div class="skill-icons">${icons}</div>` : ""}
                    <div class="skill-dots"></div>
                    <div class="skill-name">${item.name}</div>
                </div>
            `
        })
        .join("")

      return items
        ? `
            <div class="skill-group">
                ${group.title ? `<div class="skill-group-title" style="font-size: ${subsectionTitleSize}px;">${group.title}</div>` : ""}
                ${items}
            </div>
        `
        : ""
    })
    .join("")

  if (!skillGroups) return ""

  return `
        <div class="resume-section">
            <h3 style="font-size: ${sectionTitleSize}px;">${t.skills}</h3>
            ${skillGroups}
        </div>
    `
}

/**
 * Build interests HTML
 */
function buildInterests(sectionTitleSize, interestLabelSize, interestDescSize, interestIconSize, t) {
  const visibleInterests = state.interests.filter((i) => i.visible && i.label)

  if (visibleInterests.length === 0) return ""

  const items = visibleInterests
    .map(
      (interest) => `
        <div class="interest-item">
            ${interest.image ? `<img src="${interest.image}" style="width: ${interestIconSize}px; height: ${interestIconSize}px; margin-right: 12px; border-radius: 4px; object-fit: cover; flex-shrink: 0;" alt="">` : ""}
            <div class="interest-content">
                <h4 style="font-size: ${interestLabelSize}px;">${interest.label}</h4>
                ${interest.description ? `<p style="font-size: ${interestDescSize}px;">${nl2br(interest.description)}</p>` : ""}
            </div>
        </div>
    `,
    )
    .join("")

  return `
        <div class="resume-section">
            <h3 style="font-size: ${sectionTitleSize}px;">${t.interests}</h3>
            ${items}
        </div>
    `
}

/**
 * Build education HTML
 */
function buildEducations(sectionTitleSize, labelSize, descriptionSize, t) {
  const visibleEducation = state.education.filter((e) => e.visible && e.label)

  if (visibleEducation.length === 0) return ""

  const timelineImages = getTimelineImages()

  const items = visibleEducation
    .map((edu, index) => {
      const isLast = index === visibleEducation.length - 1
      return `
            <div class="timeline-item" data-id="edu-${edu.id}">
              <div class="timeline-icon">
                <img src="${timelineImages.bullet}" class="timeline-bullet" alt="">
                ${!isLast ? `<img src="${timelineImages.dash}" class="timeline-dash" alt="">` : ""}
              </div>
                <div class="timeline-content">
                    <h4 style="font-size: ${labelSize}px;">${edu.label}</h4>
                    ${edu.description ? `<p style="font-size: ${descriptionSize}px;"><span>${nl2br(edu.description)}</span></p>` : ""}
                </div>
            </div>
        `
    })
    .join("")

  return `
        <div class="resume-section">
            <h3 style="font-size: ${sectionTitleSize}px;">${t.education}</h3>
            ${items}
        </div>
    `
}

/**
 * Build experience HTML
 */
function buildExperiences(sectionTitleSize, labelSize, descriptionSize, t) {
  const visibleExperience = state.experience.filter((e) => e.visible && e.label)

  if (visibleExperience.length === 0) return ""

  const timelineImages = getTimelineImages()

  const items = visibleExperience
    .map((exp, index) => {
      const isLast = index === visibleExperience.length - 1
      return `
            <div class="timeline-item" data-id="exp-${exp.id}">
              <div class="timeline-icon">
                <img src="${timelineImages.bullet}" class="timeline-bullet" alt="">
                ${!isLast ? `<img src="${timelineImages.dash}" class="timeline-dash" alt="">` : ""}
              </div>
                <div class="timeline-content">
                    <h4 style="font-size: ${labelSize}px;">${exp.label}</h4>
                    ${exp.description ? `<p style="font-size: ${descriptionSize}px;">${nl2br(exp.description)}</p>` : ""}
                </div>
            </div>
        `
    })
    .join("")

  return `
        <div class="resume-section">
            <h3 style="font-size: ${sectionTitleSize}px;">${t.experience}</h3>
            ${items}
        </div>
    `
}

/**
 * Build footer HTML
 */
function buildFooter(t) {
  return state.showReference
    ? `
        <div class="resume-footer centered-export" style="background-color: ${state.colors.introBg}; color: ${state.colors.introText};">${t.reference}</div>
    `
    : ""
}

/**
 * Adjust timeline lines to match content height
 */
function adjustTimelineLines() {
  const timelineItems = document.querySelectorAll(".timeline-item")

  timelineItems.forEach((item) => {
    const line = item.querySelector(".timeline-line")
    if (line) {
      const content = item.querySelector(".timeline-content")
      if (content) {
        line.style.height = "calc(100% + 15px)"
      }
    }
  })
}
