export const highlightText = (text, searchQuery) => {
  if (!searchQuery?.trim() || !text) return text;

  const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");

  return text.split(regex).map((part, index) => {
    if (part.toLowerCase() === searchQuery.toLowerCase()) {
      return (
        <strong key={index} className="highlight">
          {part}
        </strong>
      );
    }
    return part;
  });
};
