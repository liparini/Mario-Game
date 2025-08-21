// Seleciona os elementos do DOM usados no jogo
const mario = document.querySelector('.mario');           // Imagem do Mario
const pipe = document.querySelector('.pipe');             // Obstáculo (cano)
const start = document.querySelector('.start');           // Botão "Iniciar"
const gameOver = document.querySelector('.game-over');    // Tela "Game Over"

// Cria objetos de áudio para sons do jogo
const audioStart = new Audio('./song/audio_theme.mp3');    // Música tema do jogo
const audioGameOver = new Audio('./song/audio_gameover.mp3'); // Som de game over

let loopInterval; // Variável global para armazenar o intervalo do loop que verifica colisões

// Função para iniciar o jogo
const startGame = () => {
    pipe.classList.add('pipe-animation'); // Ativa a animação do cano (obstáculo)
    start.style.display = 'none';          // Esconde o botão "Iniciar"

    audioStart.currentTime = 0;             // Reinicia a música do tema
    audioStart.play();                      // Toca a música do tema
};

// Função para reiniciar o jogo após game over
const restartGame = () => {
    start.style.display = 'none';           // Mantém o botão "Iniciar" escondido
    gameOver.style.display = 'none';        // Esconde a tela de game over

    // Reseta o Mario para o estado inicial
    mario.src = './img/mario.gif';           // Imagem padrão do Mario (animado)
    mario.style.width = '150px';              // Tamanho padrão
    mario.style.bottom = '0';                 // Mario no chão
    mario.style.marginLeft = '0';             // Remove margem lateral
    mario.classList.remove('jump');           // Remove a classe de pulo caso esteja aplicada

    // Reseta o cano (obstáculo)
    pipe.classList.remove('pipe-animation'); // Para a animação atual
    void pipe.offsetWidth;                    // Força o navegador a "reprocessar" o elemento (reflow) para reiniciar animação
    pipe.classList.add('pipe-animation');    // Reinicia a animação do cano
    pipe.style.left = '';                     // Limpa a posição à esquerda
    pipe.style.right = '0';                   // Coloca o cano na posição inicial à direita

    // Para o som de game over e reinicia a música do tema
    audioGameOver.pause();
    audioGameOver.currentTime = 0;

    audioStart.currentTime = 0;
    audioStart.play();

    // Reinicia a verificação de colisão
    clearInterval(loopInterval); // Para o loop atual caso exista
    loop();                     // Inicia novamente o loop
};

// Função que faz o Mario pular
const jump = () => {
    mario.classList.add('jump');               // Aplica a animação de pulo

    // Após 800ms, remove a animação para que o Mario volte ao chão
    setTimeout(() => {
        mario.classList.remove('jump');
    }, 800);
};

// Loop que verifica colisão entre Mario e o cano
const loop = () => {
    loopInterval = setInterval(() => {
        const pipePosition = pipe.offsetLeft;                   // Posição horizontal do cano
        const marioPosition = parseFloat(getComputedStyle(mario).bottom); // Posição vertical (em px) do Mario

        // Condição de colisão: cano perto demais e Mario muito baixo (não pulou)
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 90) {
            pipe.classList.remove('pipe-animation');            // Para a animação do cano
            pipe.style.left = `${pipePosition}px`;              // Fixar o cano na posição atual

            mario.src = './img/game-over.png';                   // Troca a imagem do Mario para "game over"
            mario.style.width = '80px';                           // Ajusta tamanho da imagem
            mario.style.marginLeft = '50px';                      // Ajusta margem para posicionar melhor

            audioStart.pause();                                   // Para a música tema
            audioGameOver.play();                                 // Toca o som de game over

            gameOver.style.display = 'flex';                      // Mostra a tela de game over

            clearInterval(loopInterval);                          // Para o loop de colisão
        }
    }, 10);  // Verifica colisão a cada 10 milissegundos
};

// Inicia o loop assim que a página carrega, para já detectar colisões
loop();

// Evento para escutar quando o usuário pressiona uma tecla
document.addEventListener('keypress', e => {
    const tecla = e.key;
    if (tecla === ' ') {   // Se pressionar espaço, Mario pula
        jump();
    } else if (tecla === 'Enter') {  // Se pressionar Enter, inicia o jogo
        startGame();
    }
});

// Evento para escutar toques na tela (mobile)
document.addEventListener('touchstart', e => {
    if (e.touches.length) {
        jump(); // Mario pula ao tocar na tela
    }
});
