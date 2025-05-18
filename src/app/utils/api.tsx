async function fetchDepartments() {
  const response = await fetch("/api/departments");
  const data = await response.json();
  return data;
}

async function fetchNews() {
  const response = await fetch("/api/news");
  const data = await response.json();
  return data;
}

async function fetchServices() {
  const response = await fetch("/api/services");
  const data = await response.json();
  return data;
}
