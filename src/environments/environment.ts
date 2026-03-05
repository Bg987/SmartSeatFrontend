
let production = true;
export const environment = {
  apiUrl: production ?'https://smartseatbackend.onrender.com/api':"http://localhost:8080/api",
  apiUrl2 : production ? 'https://examportalsmartseatbackend.onrender.com/api': "http://localhost:8081/api",
};