var http = require('http');
var zlib = require("zlib");
var port = Number(process.env.PORT || 5000);
var url = 'http://api.stackexchange.com/2.2/questions/707/answers?order=desc&sort=votes&site=meta.pt.stackoverflow&filter=!--pn9shUZ6Y2';

/**
 * Obtém respostas da API da Stack Exchange, e executa um callback passando um objeto com os resultados
 */
function dados(cb) {
    var buffer = [];
    http.get(url, function(res){
        var gunzip = zlib.createGunzip();            
        res.pipe(gunzip);
        gunzip.on('data', function(data) {
            buffer.push(data.toString())
        }).on("end", function() {
            cb(JSON.parse(buffer.join('')));
        }).on("error", function(e) {
            console.log('ERRO NA REQUISIÇÃO À API')
        });
    });
}

/**
 * Recebe objeto com as respostas e faz parse de cada uma delas.
 * Retorna array de objetos no formato esperado pelo AutoReviewComments
 */
function parseRespostas(resps) {
    var i, respostas = [];
    for(i=0; i<resps.length; i++) {
        respostas.push(parseResposta(resps[i]));
    }
    return respostas;
} 

/**
 * Recebe o texto da resposta em markdown e retorna objeto com título e texto
 */
function parseResposta(resp) {
    var linha, linhas = resp.body_markdown.split("\r\n");
    var prefixo, name, description = '';
    
    while(linhas.length) {
        linha = linhas.shift()
        prefixo = linha.substr(0, 4);
        if(prefixo.substr(0,3) === '###') {
            name = linha.substr(3);
        } else if(prefixo === '    ') {
            description += ' ' + linha.substr(4);
        } // else ignore
    }
    
    return {
        name: name,
        description: description  
    };
}

/**
 * Recebe objeto com as respostas e serializa como JSONP
 */
function jsonp(respostas) {
    return "callback(" + JSON.stringify(respostas) + ")";
}

/**
 * Processa a requisição e responde com JSONP
 */
http.createServer(function (req, res) {

    dados(function(json){;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(jsonp(parseRespostas(json.items)));
    })
    

}).listen(port, '127.0.0.1');
console.log('Server running at http://127.0.0.1:' + port);