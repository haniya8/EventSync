export function getDescription(category) {
  const map = {
    Sports: "",
    Arts: "",
    Music: "",
    Technology: "",
    Business: "",
  };
  return map[category] || "";
}
