import axios from 'axios';

const buildClinet = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    //     baseURL:
    //       "http://www.ticketing-appme.xyz/",
    console.log();
    return axios.create({
      baseURL:
        // 'http://www.ticketing-appme.xyz/',
        //process.env.SERVER_URL_BASE,
        //this is local //
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
    //   }
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClinet;
