require('dotenv').config();
const { default: axios } = require("axios");
const dbService = require('./database');

const api = axios.create({
  baseURL: process.env.API_URL
})

module.exports = {
  flow: {
    inicio: {
      type: 'function',
      getMessage: async (text, userDetails) => {

        let usuarioCadastrado = false;
        // executar função para buscar usuario
        if (usuarioCadastrado) {
          return ['Olá, bem-vindo de volta!', 'Você já possui cadastro! Fique atento pois ao longo do dia será enviado questões sobre o enade']
        } else {
          return ['Olá, bem vindo ao Bot Enade! Para prosseguirmos precisamos fazer seu cadastro.', 'Por favor envie seu nome completo']
        }
      },
      wiresTo: 'passo2',
    },
    passo2: {
      type: 'function',
      getMessage: async (text, userDetails) => {
        return [`Certo ${text}, agora envie seu número de matricula`]
      },
      wiresTo: 'passo3'
    },

    passo3: {
      type: 'function',
      getMessage: async (text, userDetails) => {
        return [`Agora aqui vai qualquer coisa, envia ai`]
      },
      wiresTo: 'fim_cadastro'
    },

    fim_cadastro: {
      type: 'function',
      getMessage: async (text, userDetails) => {
        return [`Obrigado, Seu cadastro foi realizado, ao longo do dia enviaremos perguntas do enade para você! Fique atento à nossas mensagens.`]
      },
    },
  }
}