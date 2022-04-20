module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '083b89e7cf3e9878986c7ed60d53a3aa'),
  },
});
