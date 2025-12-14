/* ===========================================
   PREVIEW
   Resume preview generation
   =========================================== */

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
  const educationHTML = buildEducation(sectionTitleSize, labelSize, descriptionSize, col2Text, t)
  const experienceHTML = buildExperience(sectionTitleSize, labelSize, descriptionSize, col2Text, t)
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

  if (state.firstName || state.lastName || state.jobTitle || hasContactInfo) {
    return `
            <div class="resume-header" style="background-color: ${state.colors.headerBg}; color: ${state.colors.headerText};">
                <div class="resume-header-left">
                    ${state.firstName || state.lastName ? `<h1>${state.firstName} ${state.lastName}</h1>` : ""}
                    ${state.jobTitle ? `<h2>${state.jobTitle}</h2>` : ""}
                </div>
                ${
                  hasContactInfo
                    ? `
                    <div class="resume-header-right">
                        ${state.address ? `<div>📍 ${state.address}</div>` : ""}
                        ${state.email ? `<div>✉ ${state.email}</div>` : ""}
                        ${state.phone ? `<div>📞 ${state.phone}</div>` : ""}
                        ${state.linkedin ? `<div>🔗 ${state.linkedin}</div>` : ""}
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
        <div class="resume-intro" style="background-color: ${state.colors.introBg}; color: ${state.colors.introText}; font-size: ${introSize}px;">${state.introduction}</div>
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
                ${interest.description ? `<p style="font-size: ${interestDescSize}px;">${interest.description}</p>` : ""}
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
function buildEducation(sectionTitleSize, labelSize, descriptionSize, col2Text, t) {
  const visibleEducation = state.education.filter((e) => e.visible && e.label)

  if (visibleEducation.length === 0) return ""

  const items = visibleEducation
    .map((edu, index) => {
      const isLast = index === visibleEducation.length - 1
      return `
            <div class="timeline-item" data-id="edu-${edu.id}">
                <div class="timeline-icon">
                    <div class="timeline-circle" style="border-color: ${col2Text};"></div>
                    ${!isLast ? `<div class="timeline-line" style="background-color: ${col2Text};"></div>` : ""}
                </div>
                <div class="timeline-content">
                    <h4 style="font-size: ${labelSize}px;">${edu.label}</h4>
                    ${edu.description ? `<p style="font-size: ${descriptionSize}px;">${edu.description}</p>` : ""}
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
function buildExperience(sectionTitleSize, labelSize, descriptionSize, col2Text, t) {
  const visibleExperience = state.experience.filter((e) => e.visible && e.label)

  if (visibleExperience.length === 0) return ""

  const items = visibleExperience
    .map((exp, index) => {
      const isLast = index === visibleExperience.length - 1
      return `
            <div class="timeline-item" data-id="exp-${exp.id}">
                <div class="timeline-icon">
                    <div class="timeline-circle" style="border-color: ${col2Text};"></div>
                    ${!isLast ? `<div class="timeline-line" style="background-color: ${col2Text};"></div>` : ""}
                </div>
                <div class="timeline-content">
                    <h4 style="font-size: ${labelSize}px;">${exp.label}</h4>
                    ${exp.description ? `<p style="font-size: ${descriptionSize}px;">${exp.description}</p>` : ""}
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
        <div class="resume-footer" style="background-color: ${state.colors.introBg}; color: ${state.colors.introText};">${t.reference}</div>
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
