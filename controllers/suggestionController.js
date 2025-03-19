export const getTravelSuggestions = (req, res) => {
  const destination = req.query.destination || "Travel";

  const travelIdeas = [
    "Beach Adventure",
    "City Sightseeing",
    "Local Food Tour",
    "Museum Exploration",
    "Nature Hiking",
    "River Cruise",
    "Historic Monuments Tour",
    "Nightlife & Bars",
    "Adventure Sports",
    "Shopping & Markets",
  ];

  // Shuffle and pick 5 random suggestions
  const shuffled = travelIdeas.sort(() => 0.5 - Math.random());
  const suggestions = shuffled.slice(0, 5).map((idea) => `${destination} ${idea}`);

  res.json({ suggestions });
};
