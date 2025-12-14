/* ===========================================
   FONT UTILITIES
   Font size calculations
   =========================================== */

const BASE_FONT_SIZES = {
  sectionTitle: 24,
  subsectionTitle: 16,
  label: 15,
  description: 13,
  skillName: 14,
  interestLabel: 16,
  interestDesc: 13,
  intro: 15,
}

/**
 * Get calculated font size based on type and multipliers
 * @param {string} type - The font type
 * @returns {number} - Calculated font size in pixels
 */
function getFontSize(type) {
  const base = BASE_FONT_SIZES[type] || 14
  const global = state.fontSizes.global

  let specific = 1
  switch (type) {
    case "sectionTitle":
      specific = state.fontSizes.sectionTitle
      break
    case "subsectionTitle":
      specific = state.fontSizes.subsectionTitle
      break
    case "label":
    case "skillName":
    case "interestLabel":
      specific = state.fontSizes.label
      break
    case "description":
    case "interestDesc":
    case "intro":
      specific = state.fontSizes.description
      break
  }

  return base * global * specific
}

/**
 * Get calculated icon size based on multipliers
 * @param {number} baseSize - Base icon size
 * @returns {number} - Calculated icon size in pixels
 */
function getIconSize(baseSize) {
  return baseSize * state.fontSizes.global * state.fontSizes.label
}
