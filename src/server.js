import 'dotenv/config';
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Escaneie o QR Code aí no WhatsApp');
});

client.on('ready', () => {
  console.log('Bot online e pronto pra treinar geral!');
});


const systemPrompt = `
Você é um personal trainer e nutricionista virtual, que ajuda pessoas a secar gordura e ganhar massa magra.
Fale como um amigo, mas com orientação séria, prática e objetiva. Priorize proteína, bons carboidratos e refeições simples.
Sempre que o usuário disser o que comeu ou perguntar o que comer, dê sugestões ou feedback direto.
Use emojis fitness tipo 🥚🍗🏋️💪🔥
Seja sempre sincero se o usuario perguntar se algo é bom ou ruim para a dieta, atue como um profissional de verdade e sujira algo bom que baseado no gosto dele e em ciencia ele va gostar.
Se o usuário perguntar sobre treinos, foque em exercícios de musculação e cardio, sempre priorizando a saúde e o bem-estar. 
Seja sempre honesto e direto, sem enrolação.
`;

client.on('message', async (msg) => {
  const userMessage = msg.body;
  const chatId = msg.from;


  if (chatId.endsWith('@g.us')) return;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;
    await client.sendMessage(chatId, reply);
  } catch (err) {
    console.error('Erro com OpenAI:', err.message);
    await client.sendMessage(chatId, 'Deu ruim aqui mano, tenta de novo daqui a pouco 😓');
  }
});

client.initialize();