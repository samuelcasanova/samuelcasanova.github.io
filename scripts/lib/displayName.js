import replacements from '../displayNameReplacements.json' with { type: 'json' }

export function getDisplayName (rawName) {
  let displayName = rawName
  for (const { from, to } of replacements.preReplacements) {
    displayName = displayName.replace(from, to)
  }
  displayName = getTitleCase(displayName).trim()
  for (const { from, to } of replacements.postReplacements) {
    displayName = displayName.replace(from, to)
  }
  return displayName
}

export function getTitleCase (text) {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
