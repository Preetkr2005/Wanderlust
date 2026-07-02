const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// CONFIGURE CLOUDINARY NOW ABLE TO ACCESS OUR CLOUD PLATFORM
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// CREATING FOLDER IN CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Major_Project',
    allowedFormats: ["png", "jpg", "jpeg"],     
  },
});

module.exports = {
    cloudinary,
    storage
}