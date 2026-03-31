let production = false;
export const environment = {

  apiUrl: production ? 'https://proxy-0xaq.onrender.com/api1' : "http://localhost:8080/api",
  apiUrl2 :  production ?'https://proxy-0xaq.onrender.com/api2':"http://localhost:8081/api",
};