require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const SimpleChatBot = require('simple-node-chatbot');
const flow = require('./chatflow.js');
const dbService = require('./database.js')


const bot = new SimpleChatBot({
    chatFlow: flow,
    welcomeFlow: "inicio",
    dbService: dbService,
})


const token = process.env.TG_TOKEN;
const Telegram = new TelegramBot(token, { polling: true });


var userTest = [];

Telegram.on('message', async (msg) => {

    const chatId = msg.chat.id;
    const texto_mensagem = msg.text
    const sessionUser = await dbService.getUser(chatId)
    if (texto_mensagem == "/start") {
        console.log("Mensagem recebida")

        if (!sessionUser) {
            await dbService.saveUser({
                from: chatId,
                next_flow: 'inicio'
            });
        }
        userTest.push(chatId)
        bot.getMessage(texto_mensagem, chatId).then((resposta) => {
            if (resposta) {
                resposta.forEach(resp => {
                    Telegram.sendMessage(chatId, resp);
                });
            }
        });


    } else if (texto_mensagem == "/sair") {
        await dbService.removeUser(chatId)
        Telegram.sendMessage(chatId, "Certo, seu cadastro foi removido! A partir de agora você não receberá mais mensagens. Caso deseja retornar, envie o comando /start");
    } else {
        if(!sessionUser){
            Telegram.sendMessage(chatId, 'Você ainda não está cadastrado para receber nossas questões! Envie o comando /start para iniciar seu registro.');
        }else if (sessionUser?.next_flow) {
            bot.getMessage(texto_mensagem, chatId).then((resposta) => {
                if (resposta) {
                    resposta.forEach(resp => {
                        Telegram.sendMessage(chatId, resp);
                    });
                }
            });
        } else {
            Telegram.sendMessage(chatId, "Você ja possui cadastro! Aguarde que ao longo do dia estaremos enviando questões para você. Caso você deseja remover sua inscrição, envie o comando: /sair");
        }
    }


})


// função para executar tarefa a cada 5 minutos
cron.schedule('*/2 * * * *', () => {
    console.log('Executando tarefa....');

    const pergunta = 'Quanto é 1+1';
    const opcoes = ['3', '2', '9', '17', '26'];

    const usuarios = userTest;
    usuarios.forEach((user) => {
        if (user) {
            Telegram.sendPoll(user, pergunta, opcoes, {
                type: 'quiz',
                correct_option_id: 1,
                explanation: 'Porque se somar 1+1 o resultado é 2',
                allows_multiple_answers: false
            })
        }
    })
});