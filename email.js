import { Resend } from 'resend';

const resend = new Resend('re_TChD66ke_NUBfshHKuqEn99Tu99xHFZGr');

(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Acme <kgomezr2@unicartagena.edu.co>',
    to: ['quinteromoralesivan@gmail.com'],
    subject: 'Hello World',
    html: '<strong>It works! ivanovich</strong>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();