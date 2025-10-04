const handleProjectName = (name) => {
  if (!name) return "my-app";
  return name.replace(/\s+/g, "-").toLowerCase();
};

export default handleProjectName;
