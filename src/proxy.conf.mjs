export default {
  "/scgrafana": {
    target: "http://localhost:3100",
    secure: false,
    bypass: function (req, res, proxyOptions) {
      req.headers["X-WEBAUTH-USER"] = "user";
    },
  },
  "/skyspark": {
    target: "http://localhost:8080",
    secure: false,
    pathRewrite: {
      "/skyspark": `api/demo`,
    },
    bypass: function (req, res, proxyOptions) {
      req.headers["Accept"] = "application/vnd.haystack+json;version=4";
      req.headers["Content-Type"] = "text/zinc; charset=utf-8";
    },
  },
};
