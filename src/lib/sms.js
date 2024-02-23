// dependencies

const accountSid = 'AC796dc13bf74dd081ac6c78a68e09b9db';
const authToken = '293e347d33142448b3f3126ce54aa2eb';
import twilio from 'twilio';
const client = twilio(accountSid, authToken);



// exports

client.messages
  .create({
    body: 'this is a test :)',
    from: '+18555076533',
    to: '+12035719077'
  })
  .then(message => console.log(message.sid))
  .catch((err) => console.log(err));
