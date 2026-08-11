/* ================================================================
   MENU MOBILE
   Controla abertura, fechamento, atributos de acessibilidade e rolagem.
   ================================================================ */
const botaoMenu = document.querySelector('.menu-botao');
const menu = document.querySelector('.menu');

/** Fecha o menu e restaura o estado inicial do botão. */
function fecharMenu() {
    botaoMenu.classList.remove('ativo');
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-aberto');
}

/** Alterna o menu quando o usuário toca ou clica no botão sanduíche. */
botaoMenu.addEventListener('click', () => {
    const estaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';

    if (estaAberto) {
        fecharMenu();
        return;
    }

    botaoMenu.classList.add('ativo');
    menu.classList.add('aberto');
    botaoMenu.setAttribute('aria-expanded', 'true');
    botaoMenu.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('menu-aberto');
});

/* Fecha o painel depois que uma opção de navegação é escolhida. */
menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
});

/* A tecla Escape é um padrão de acessibilidade para fechar painéis. */
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
        fecharMenu();
    }
});

/* Evita manter o menu mobile aberto quando a tela volta ao modo desktop. */
window.addEventListener('resize', () => {
    if (window.innerWidth > 920) {
        fecharMenu();
    }
});

/* ================================================================
   FORMULÁRIO DE LEADS
   Hoje valida e simula o envio. A função enviarLead() pode receber a
   integração com Supabase futuramente sem alterar o HTML do formulário.
   ================================================================ */
const formulario = document.querySelector('[data-lead-form]');
const statusFormulario = document.querySelector('[data-form-status]');

/** Remove mensagens e bordas de erro antes de uma nova tentativa. */
function limparErros() {
    statusFormulario.textContent = '';
    statusFormulario.className = 'formulario-status';
    formulario.querySelectorAll('.invalido').forEach((campo) => {
        campo.classList.remove('invalido');
    });
}

/**
 * Ponto preparado para a futura integração.
 * Exemplo futuro: supabase.from('leads').insert(dadosDoLead).
 */
async function enviarLead(dadosDoLead) {
    /* Mantém a função assíncrona e permite substituir apenas este bloco. */
    await Promise.resolve(dadosDoLead);
    return { sucesso: true };
}

/** Valida os campos e envia os dados somente quando tudo estiver correto. */
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limparErros();

    if (!formulario.checkValidity()) {
        const primeiroCampoInvalido = formulario.querySelector(':invalid');

        if (primeiroCampoInvalido) {
            primeiroCampoInvalido.classList.add('invalido');
            primeiroCampoInvalido.focus();
        }

        statusFormulario.textContent = 'Revise os campos obrigatórios para continuar.';
        statusFormulario.classList.add('erro');
        return;
    }

    /* FormData usa os atributos name do HTML para criar o objeto do lead. */
    const dadosDoLead = Object.fromEntries(new FormData(formulario).entries());
    const botaoEnviar = formulario.querySelector('button[type="submit"]');
    const textoOriginal = botaoEnviar.innerHTML;

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Enviando...';

    try {
        const resultado = await enviarLead(dadosDoLead);

        if (!resultado.sucesso) {
            throw new Error('Não foi possível registrar o lead.');
        }

        /* Mensagem honesta enquanto ainda não existe persistência no Supabase. */
        statusFormulario.textContent = 'Formulário validado! Conecte o Supabase para registrar este lead.';
        statusFormulario.classList.add('sucesso');
        formulario.reset();
    } catch (erro) {
        statusFormulario.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
        statusFormulario.classList.add('erro');
        console.error('Erro ao enviar lead:', erro);
    } finally {
        botaoEnviar.disabled = false;
        botaoEnviar.innerHTML = textoOriginal;
    }
});

/* ================================================================
   RODAPÉ
   Mantém o ano atualizado automaticamente.
   ================================================================ */
document.querySelector('[data-ano]').textContent = new Date().getFullYear();
