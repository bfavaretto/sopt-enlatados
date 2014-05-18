##Comentários Enlatados do Stack Overflow em Português

Acessa a API da Stack Exchange, obtém os [comentários enlatados do SOpt][1], e os serve como JSONP no formato esperado pela extensão [AutoReviewComments][2].

###Requisitos

 - Node.js

###Como usar

 - Inicie a aplicação:

        $ node app.js
        
  O serviço irá rodar em `localhost:5000`
 
 - No AutoReviewComments, clique no link *remote* no rodapé.
 - Informe a URL `http://localhost:5000`.
 - Clique em *get now*.


  [1]: http://meta.pt.stackoverflow.com/questions/707/comentarios-enlatados-para-situacoes-comuns
  [2]: http://stackapps.com/questions/2116/autoreviewcomments-pro-forma-comments-for-se