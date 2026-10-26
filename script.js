
"use strict";

/* ==========================================
   FORMATECH - ASSISTENTE VIRTUAL
   Chat por texto, voz e respostas faladas
   ========================================== */

// EDITE ESTAS CONFIGURAÇÕES
const instituicao = {
    nome: "FormaTech",

    horarioInicio: "07:00",
    horarioFim: null, // Exemplo: "17:00". null = não informado.

    endereco:
        "Avenida Bernardino Flora Furlan, 1920, Zona Norte, Distrito Industrial, Pederneiras - SP.",

    cursos: {
        dev: {
            nome: "Desenvolvimento (DEV)",
            descricao:
                "Formação voltada à programação, criação de sites, sistemas e tecnologia."
        },

        logistica: {
            nome: "Logística",
            descricao:
                "Formação voltada à organização de estoques, transportes, armazenagem e distribuição."
        }
    },

    idadeMinima:
        "A idade mínima depende dos requisitos de cada curso. Consulte a instituição para confirmar a idade exigida e os pré-requisitos de matrícula."
};


// ELEMENTOS DA PÁGINA
const mensagens = document.getElementById("chat-messages");
const campoTexto = document.getElementById("chat-input");
const formulario = document.getElementById("chat-form");
const botaoMicrofone = document.getElementById("mic-button");
const botaoLimpar = document.getElementById("clear-chat");
const botaoAudio = document.getElementById("toggle-audio");
const areaCards = document.getElementById("faq-cards");
const statusVoz = document.getElementById("voice-status");

let audioAtivado = true;
let reconhecimento = null;
let ouvindo = false;


// PERGUNTAS FREQUENTES DOS CARDS
const perguntasFrequentes = [
    {
        icone: "🕒",
        titulo: "Horário de atendimento",
        pergunta: "Qual é o horário de atendimento?"
    },
    {
        icone: "📍",
        titulo: "Localização",
        pergunta: "Qual é o endereço da instituição?"
    },
    {
        icone: "🎓",
        titulo: "Cursos disponíveis",
        pergunta: "Quais cursos estão disponíveis?"
    },
    {
        icone: "🧭",
        titulo: "Como escolher o curso",
        pergunta: "Como posso escolher meu curso?"
    },
    {
        icone: "👤",
        titulo: "Idade mínima",
        pergunta: "Qual é a idade mínima para fazer os cursos?"
    }
];


// NORMALIZAR TEXTO: RETIRAR ACENTOS E PADRONIZAR
function normalizar(texto) {
    return texto
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// ADICIONAR MENSAGEM AO CHAT
function adicionarMensagem(texto, remetente) {
    const mensagem = document.createElement("div");
    mensagem.classList.add("message", remetente);
    mensagem.setAttribute("dir", "auto");

    // textContent impede que o texto digitado seja interpretado como HTML.
    mensagem.appendChild(document.createTextNode(texto));

    const horario = document.createElement("span");
    horario.className = "message-time";
    horario.textContent = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    mensagem.appendChild(horario);
    mensagens.appendChild(mensagem);
    mensagens.scrollTop = mensagens.scrollHeight;
}


// RESPONDER SOBRE O HORÁRIO
function respostaHorario() {
    if (instituicao.horarioFim) {
        return (
            "Nosso horário de atendimento é das " +
            instituicao.horarioInicio + " às " +
            instituicao.horarioFim + "."
        );
    }

    return (
        "Nosso atendimento começa às " +
        instituicao.horarioInicio +
        ". O horário de encerramento ainda precisa ser confirmado pela instituição."
    );
}


// IDENTIFICAR PERGUNTAS E GERAR RESPOSTAS
function responderPergunta(pergunta) {
    const texto = normalizar(pergunta);

    // SAUDAÇÕES
    if (
        /^(oi|ola|eai|eae|opa|bom dia|boa tarde|boa noite)[!. ]*$/.test(texto)
    ) {
        return (
            "Olá! Seja bem-vindo à " + instituicao.nome +
            "! Sou o assistente virtual e posso ajudar com informações " +
            "sobre cursos, horários, endereço, inscrições e idade mínima."
        );
    }

    // AGRADECIMENTOS
    if (
        texto.includes("obrigado") ||
        texto.includes("obrigada") ||
        texto.includes("valeu")
    ) {
        return "Por nada! Estou aqui para ajudar. Tem mais alguma dúvida sobre nossos cursos?";
    }

    // HORÁRIO DE ATENDIMENTO
    if (
        texto.includes("horario") ||
        texto.includes("funcionamento") ||
        texto.includes("que horas") ||
        texto.includes("abre") ||
        texto.includes("fecha") ||
        texto.includes("atendimento")
    ) {
        return respostaHorario();
    }

    // LOCALIZAÇÃO
    if (
        texto.includes("endereco") ||
        texto.includes("localizacao") ||
        texto.includes("onde fica") ||
        texto.includes("como chegar") ||
        texto.includes("local da instituicao")
    ) {
        return (
            "Nossa instituição fica na seguinte localização: " +
            instituicao.endereco +
            " Você também pode consultar o endereço no Google Maps, pelo link disponível na página."
        );
    }

    // PERGUNTAS SOBRE IDADE
    if (
        texto.includes("idade") ||
        texto.includes("quantos anos") ||
        texto.includes("menor de idade") ||
        texto.includes("idade minima") ||
        texto.includes("posso fazer o curso com")
    ) {
        return instituicao.idadeMinima;
    }

    // ESCOLHA, MATRÍCULA E INSCRIÇÃO
    if (
        texto.includes("escolher") ||
        texto.includes("escolha") ||
        texto.includes("qual curso") ||
        texto.includes("decidir") ||
        texto.includes("inscricao") ||
        texto.includes("inscrever") ||
        texto.includes("matricula") ||
        texto.includes("como entrar")
    ) {
        return (
            "Para escolher seu curso, considere seus interesses e objetivos profissionais. " +
            "Se você gosta de tecnologia e programação, conheça Desenvolvimento (DEV). " +
            "Se prefere organização, estoques e transporte, conheça Logística. " +
            "Para realizar a matrícula, consulte a instituição sobre inscrições abertas, " +
            "documentos necessários e critérios de seleção."
        );
    }

    // LISTA DE CURSOS
    if (
        texto.includes("quais cursos") ||
        texto.includes("cursos disponiveis") ||
        texto.includes("cursos oferecidos") ||
        texto.includes("quais sao os cursos") ||
        texto.includes("tem curso") ||
        texto.includes("lista de cursos") ||
        texto.includes("o que voces ensinam")
    ) {
        return (
            "Temos duas áreas de formação: " +
            instituicao.cursos.dev.nome + " e " +
            instituicao.cursos.logistica.nome + ". " +
            "A disponibilidade de turmas deve ser confirmada com a instituição."
        );
    }

    // DEV E PROGRAMAÇÃO
    if (
        texto.includes("dev") ||
        texto.includes("programacao") ||
        texto.includes("programador") ||
        texto.includes("desenvolvimento") ||
        texto.includes("criar sites") ||
        texto.includes("tecnologia")
    ) {
        return (
            instituicao.cursos.dev.nome + ": " +
            instituicao.cursos.dev.descricao +
            " Consulte a instituição para saber sobre turmas, duração e requisitos."
        );
    }

    // LOGÍSTICA
    if (
        texto.includes("logistica") ||
        texto.includes("estoque") ||
        texto.includes("armazenagem") ||
        texto.includes("transporte") ||
        texto.includes("distribuicao")
    ) {
        return (
            instituicao.cursos.logistica.nome + ": " +
            instituicao.cursos.logistica.descricao +
            " Consulte a instituição para saber sobre turmas, duração e requisitos."
        );
    }

    // CUSTOS E PREÇOS
    if (
        texto.includes("preco") ||
        texto.includes("valor do curso") ||
        texto.includes("quanto custa") ||
        texto.includes("e gratuito") ||
        texto.includes("mensalidade")
    ) {
        return (
            "Não tenho informações confirmadas sobre os valores dos cursos. " +
            "Entre em contato com a instituição para verificar se há mensalidade, " +
            "taxa de inscrição ou opções gratuitas."
        );
    }

    // DURAÇÃO DOS CURSOS
    if (
        texto.includes("duracao") ||
        texto.includes("quanto tempo") ||
        texto.includes("quantos meses") ||
        texto.includes("quantas horas")
    ) {
        return (
            "A duração pode variar conforme o curso e a turma. " +
            "Entre em contato com a instituição para confirmar a carga horária de DEV e Logística."
        );
    }

    // DOCUMENTOS
    if (
        texto.includes("documentos") ||
        texto.includes("documentacao") ||
        texto.includes("o que levar")
    ) {
        return (
            "Os documentos exigidos precisam ser confirmados com a instituição. " +
            "Pergunte quais documentos pessoais e escolares são necessários para a matrícula."
        );
    }

    // CERTIFICADO
    if (texto.includes("certificado") || texto.includes("diploma")) {
        return (
            "Para saber se o curso oferece certificado, quais são os critérios " +
            "de conclusão e como ele é emitido, consulte a instituição."
        );
    }

    // CONTATO
    if (
        texto.includes("telefone") ||
        texto.includes("whatsapp") ||
        texto.includes("email") ||
        texto.includes("contato")
    ) {
        return (
            "Não tenho um telefone ou e-mail confirmado para informar. " +
            "Consulte os canais oficiais da instituição para obter os contatos atualizados."
        );
    }

    // AJUDA
    if (
        texto.includes("ajuda") ||
        texto.includes("duvidas") ||
        texto.includes("o que voce faz")
    ) {
        return (
            "Posso responder perguntas sobre horário de atendimento, localização, " +
            "cursos disponíveis, escolha do curso, idade mínima, matrículas, " +
            "preços, duração, documentos e certificados."
        );
    }

    // RESPOSTA NÃO ENCONTRADA
    return (
        "Desculpe, ainda não tenho uma resposta confirmada para essa pergunta. " +
        "Você pode perguntar sobre horário, endereço, cursos de DEV e Logística, " +
        "idade mínima ou inscrições."
    );
}


// SÍNTESE DE VOZ
function falarTexto(texto) {
    if (!audioAtivado || !("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;

    const vozes = window.speechSynthesis.getVoices();

    const vozPortugues = vozes.find(function (voz) {
        return voz.lang.toLowerCase().startsWith("pt-br");
    }) || vozes.find(function (voz) {
        return voz.lang.toLowerCase().startsWith("pt");
    });

    if (vozPortugues) {
        fala.voice = vozPortugues;
    }

    window.speechSynthesis.speak(fala);
}


// PROCESSAR PERGUNTA
function enviarPergunta(pergunta) {
    const texto = (pergunta || "").trim();

    if (!texto) {
        return;
    }

    adicionarMensagem(texto, "user");

    const resposta = responderPergunta(texto);

    adicionarMensagem(resposta, "bot");
    falarTexto(resposta);

    campoTexto.value = "";
    campoTexto.focus();
}


// CRIAR CARDS CLICÁVEIS
function criarCards() {
    perguntasFrequentes.forEach(function (item) {
        const card = document.createElement("button");

        card.type = "button";
        card.className = "faq-card";
        card.setAttribute("aria-label", item.pergunta);

        const icone = document.createElement("span");
        icone.className = "faq-icon";
        icone.setAttribute("aria-hidden", "true");
        icone.textContent = item.icone;

        const titulo = document.createElement("span");
        titulo.className = "faq-title";
        titulo.textContent = item.titulo;

        card.append(icone, titulo);

        card.addEventListener("click", function () {
            enviarPergunta(item.pergunta);
        });

        areaCards.appendChild(card);
    });
}


// ENVIO DO FORMULÁRIO
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    enviarPergunta(campoTexto.value);
});


// BOTÕES "SABER MAIS" DOS CURSOS
document.querySelectorAll(".course-button").forEach(function (botao) {
    botao.addEventListener("click", function () {
        enviarPergunta(botao.dataset.question);
    });
});


// ATIVAR OU DESATIVAR RESPOSTAS EM ÁUDIO
botaoAudio.addEventListener("click", function () {
    audioAtivado = !audioAtivado;

    botaoAudio.textContent = audioAtivado
        ? "🔊 Áudio ativado"
        : "🔇 Áudio desativado";

    botaoAudio.setAttribute("aria-pressed", String(audioAtivado));

    if (!audioAtivado && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    } else if (audioAtivado) {
        statusVoz.textContent = "Áudio ativado. As próximas respostas serão faladas.";
    }
});


// RECONHECIMENTO DE VOZ
const ReconhecimentoVoz =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (ReconhecimentoVoz) {
    reconhecimento = new ReconhecimentoVoz();

    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;
    reconhecimento.maxAlternatives = 1;

    reconhecimento.onstart = function () {
        ouvindo = true;
        botaoMicrofone.classList.add("listening");
        botaoMicrofone.textContent = "⏹️";
        botaoMicrofone.setAttribute("aria-label", "Parar gravação");
        statusVoz.textContent = "Estou ouvindo. Fale sua pergunta...";
    };

    reconhecimento.onresult = function (evento) {
        const pergunta = evento.results[0][0].transcript;

        statusVoz.textContent = "Pergunta reconhecida: " + pergunta;
        enviarPergunta(pergunta);
    };

    reconhecimento.onerror = function (evento) {
        const mensagensErro = {
            "not-allowed": "Permita o acesso ao microfone nas configurações do navegador.",
            "no-speech": "Nenhuma fala detectada. Tente falar novamente.",
            "audio-capture": "Nenhum microfone disponível foi encontrado.",
            "network": "O reconhecimento de voz apresentou um erro de rede."
        };

        statusVoz.textContent =
            mensagensErro[evento.error] ||
            "Não foi possível reconhecer a voz. Tente novamente.";
    };

    reconhecimento.onend = function () {
        ouvindo = false;
        botaoMicrofone.classList.remove("listening");
        botaoMicrofone.textContent = "🎤";
        botaoMicrofone.setAttribute("aria-label", "Fazer pergunta por voz");
    };

    botaoMicrofone.addEventListener("click", function () {
        if (ouvindo) {
            reconhecimento.stop();
            return;
        }

        try {
            reconhecimento.start();
        } catch (erro) {
            statusVoz.textContent =
                "Não foi possível iniciar o microfone. Tente novamente.";
        }
    });
} else {
    botaoMicrofone.addEventListener("click", function () {
        statusVoz.textContent =
            "Seu navegador não suporta reconhecimento de voz. " +
            "Experimente uma versão atualizada do Google Chrome.";
    });
}


// LIMPAR CONVERSA
botaoLimpar.addEventListener("click", function () {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    if (ouvindo && reconhecimento) {
        reconhecimento.stop();
    }

    mensagens.replaceChildren();

    adicionarMensagem(
        "Olá! Sou o assistente virtual da " +
        instituicao.nome +
        ". Como posso ajudar você hoje?",
        "bot"
    );

    statusVoz.textContent =
        "Digite uma pergunta ou utilize o microfone.";
});


// ANO AUTOMÁTICO NO RODAPÉ
document.getElementById("current-year").textContent =
    new Date().getFullYear();


// INICIALIZAÇÃO
criarCards();

adicionarMensagem(
    "Olá! Seja bem-vindo à " +
    instituicao.nome +
    "! Sou seu assistente virtual. Você pode clicar em uma das perguntas frequentes, digitar ou falar comigo. Como posso ajudar?",
    "bot"
);
