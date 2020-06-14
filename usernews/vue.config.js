module.exports = {
  devServer: {
    host: "127.0.0.1",
    port: "8081",
    proxy: {
      "/comment": {
        target: "http://182.92.161.193:8888",
        changeOrigin: true,
        secure: false,
      },
      "/token": {
        target: "http://182.92.161.193:8888",
        changeOrigin: true,
        secure: false,
      },
      "/admin": {
        target: "http://182.92.161.193:8888",
        changeOrigin: true,
        secure: false,
      },
      "/user": {
        target: "http://182.92.161.193:8888",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}
