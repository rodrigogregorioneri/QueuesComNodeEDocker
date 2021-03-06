#!/usr/bin/env node
var amqp = require('amqplib');

setTimeout(function() { //Espera o Rabbitmq subir
  amqp.connect('amqp://rabbitmq:rabbitmq@rabbitmq')
  .then(function(conn) {
    return conn.createChannel();
  })
  .then(function(ch) {
    // Quantas mensagens o consumidor irá pegar por vez.  Sem isso, ele irá pegar todas
    ch.prefetch(1);

    //Cria um listening que vai disparar o callbacl sempre que houver uma nova mensagem na fila
    ch.consume('email', function(msg) {
      setTimeout(function() {
        console.log('E-mail para ser enviado: %s', msg.content.toString());
        // Retorna o ACK para o servidor. Está tudo ok, tira da fila!
        ch.ack(msg);

        //ch.nack(msg) Retorna um No ACK para o servidor.
      }, 2000); // Timeout pra simular alguma coisa pesada sendo processada
    });
  });
}, 10000);
