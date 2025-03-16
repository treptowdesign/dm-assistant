export function simpleMarkdownToHtml(markdown) {
    return markdown
      .replace(/^(#+) (.*)/gm, (_, hashes, text) => `<h${hashes.length}>${text}</h${hashes.length}>`) // Headings
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/`([^`]+)`/g, "<code>$1</code>"); // Inline code
      // .replace(/\n/g, "<br>"); // Line breaks (disabled for now, adds too many)
}
  