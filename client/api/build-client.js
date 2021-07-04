import axios from 'axios';

const buildClinet = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    
    if(process.env.NODE_ENV === "production"){
      return axios.create({
        baseURL:
          "http://www.ticketing-appme.xyz/",
        headers: req.headers,
        });
    }else{
      return axios.create({
        baseURL:
          //this is local //
           "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers: req.headers,
        });
    }

  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClinet;
