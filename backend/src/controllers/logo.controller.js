const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'logos' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};


async function uploadLogo(req, reply) {
  try {
    const data = await req.file(); 

    if (!data) {
      return reply.status(400).send({ error: 'Nenhum arquivo enviado' });
    }

    const result = await uploadToCloudinary(data.file);
    return reply.send({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: 'Falha no upload da logo' });
  }
}

module.exports = {
  uploadLogo
};
