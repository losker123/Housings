// function sendMail (name, ownerEmail) {
//   const nodemailer = require("nodemailer");
//   const directTransport = require('nodemailer-direct-transport');
//   const fromHost = `gamil.com`;
//   const from = 'shareeasy.rent' + '@' + fromHost;
//   const to = 'ant1kow22@gamil.com';
//   const transport = nodemailer.createTransport(directTransport({
//     name: fromHost
//   }));
  
//   transport.sendMail({
//     from, to,
//     subject: `Поступило сообщение об арнеде: ${name}`,
//     html: `
//         <h1> Письмо </h1>
//         <h2> Отправленное из React </h2>
//         <p>Арендатор: ${ownerEmail}</p>
//           `
//   }, (err, data) => {
//     if (err) {
//       console.error('Send error:', err);
//     } else {
//       console.log('email has been sent');
//     }
//   });
// }

// module.exports = {sendMail}