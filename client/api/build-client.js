import axios from 'axios';

const buildClinet = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL:
        //this is local //
         "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        //this is production:
        //"http://www.ticketing-appme.xyz/",

      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClinet;
