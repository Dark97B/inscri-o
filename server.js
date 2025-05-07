const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Rota de envio
app.post('/enviar', upload.single('video'), async (req, res) => {
  const { nome, idade, escolaridade, cidade, bairro, whatsapp, email } = req.body;
  const videoPath = req.file.path;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'SEU_EMAIL@gmail.com', // Substitua
      pass: 'SENHA_DO_APP',         // Substitua (senha de app, não a senha normal!)
    },
  });

  const mailOptions = {
    from: 'SEU_EMAIL@gmail.com',
    to: 'jeffersonolivernuke05@gmail.com',
    subject: 'Nova Inscrição Recebida',
    text: `
      Nome: ${nome}
      Idade: ${idade}
      Escolaridade: ${escolaridade}
      Cidade: ${cidade}
      Bairro: ${bairro}
      WhatsApp: ${whatsapp}
      E-mail: ${email}
    `,
    attachments: [
      {
        filename: req.file.originalname,
        path: videoPath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('✅ Inscrição enviada com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).send('❌ Erro ao enviar inscrição.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
//http:localhost:3000