let personImg;
let personX = 185; // Posição inicial do personagem
let particles = []; // Array para armazenar as partículas
let progress = 0; // Variável para controlar o progresso da barra
let padding = 20; // Padding (espaço) no canto superior esquerdo para a barra
let maxBarWidth; // Variável para o tamanho máximo da barra
let bgImg; // Variável para armazenar a imagem de fundo
let carpetImg; // Variável para armazenar a imagem do tapete
let wallX = 850; // Posição X da parede
let wallWidth = 50; // Largura da parede
let wallHeight; // Altura da parede (igual à altura do canvas)
let showCollisionMessage = false; // Variável para controlar a exibição da mensagem de colisão
let gameStarted = false; // Variável para controlar se o jogo começou
let cenarioImg; // Imagem do menu inicial
let playImg; // Imagem do botão de "Play"
let playButton; // Botão invisível sobre a imagem do botão
let shockSound; // Variável para o som do choque

function preload() {
  personImg = loadImage('images/person.png'); // Substitua pelo caminho correto da imagem do personagem
  bgImg = loadImage('images/sala2.png'); // Substitua pelo caminho correto da imagem do fundo
  carpetImg = loadImage('images/carpet.png'); // Substitua pelo caminho correto da imagem do tapete
  cenarioImg = loadImage('images/cenario.png'); // Imagem de fundo para o menu inicial
  playImg = loadImage('images/play.png'); // Imagem do botão "Play"
  backgroundMusic = loadSound('audios/music.mp3'); // Música de fundo
  shockSound = loadSound('audios/shock.mp3'); // Som do choque
}

function setup() {
  createCanvas(900, 600);
  maxBarWidth = width / 2 - 2 * padding; // Define o tamanho máximo da barra
  wallHeight = height - 600; // Altura da parede

  // Cria o botão invisível para detectar cliques
  playButton = createButton("");
  playButton.position(width / 2 - 50, height / 2 + 50); // Centraliza o botão
  playButton.size(100, 100); // Ajuste ao tamanho da imagem
  playButton.style("background", "transparent"); // Torna o botão invisível
  playButton.style("border", "none"); // Remove bordas
  playButton.mousePressed(startGame); // Associa a função ao clique
}

function draw() {
  if (!gameStarted) {
    // Desenha o menu inicial
    image(cenarioImg, 0, 0, width, height); // Imagem de fundo do menu inicial
    image(playImg, width / 2 - 75, height / 2 + 50, 150, 120); // Imagem do botão "Play"
    return; // Sai da função draw enquanto o jogo não começou
  }

  // Desenha a imagem de fundo
  image(bgImg, 0, 0, width, height);

  // Desenha o tapete no chão
  image(carpetImg, 215, 455, 370, 300);

  // Desenhando a barra de progresso
  fill(0, 0, 255);
  rect(padding, padding, map(progress, 0, 100, 0, maxBarWidth), 20);

  // Adicionando borda à barra
  noFill();
  stroke(0);
  strokeWeight(1);
  rect(padding, padding, maxBarWidth, 20);

  // Gerando partículas
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // Adicionando o personagem no cenário
  image(personImg, personX, 235, 160, 340);

  // Movimento do personagem
  if (keyIsDown(RIGHT_ARROW)) {
    personX += 5;
    if (personX + 50 > 275 && personX + 50 < 550) {
      createParticles(personX + 50, 570);
      if (progress < 100) {
        progress += 0.5;
      }
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    personX -= 5;
    if (personX + 50 > 275 && personX + 50 < 550) {
      createParticles(personX + 50, 570);
      if (progress < 100) {
        progress += 0.5;
      }
    }
  }

  // Impede que o personagem saia da tela pela direita
  if (personX > 645) {
    personX = 645;
  }

  // Impede o personagem de sair da tela pela esquerda
  if (personX < 0) {
    personX = 0;
  }

  // Lógica de colisão com a parede
  if (progress >= 100 && personX + 210 >= wallX) {
    showCollisionMessage = true; // Exibe a mensagem de colisão
    generateShockParticles(wallX - 50, random(0, wallHeight)); // Gera partículas na posição aleatória da parede
    if (!shockSound.isPlaying()) {
    shockSound.play(); // Toca o som do choque
  }
    
  } else {
    showCollisionMessage = false; // Desativa a mensagem caso não tenha colisão
    shockSound.stop();
  }

  // Exibe a mensagem de colisão
  if (showCollisionMessage) {
    fill(255, 0, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Você morreu!", width / 2, height / 2);
    noStroke();
  }
}

// Função chamada ao pressionar o botão "Iniciar"
function startGame() {
  gameStarted = true; // Atualiza o estado do jogo
  playButton.hide(); // Esconde o botão
  if (!backgroundMusic.isPlaying()) {
     backgroundMusic.setVolume(0.10); // Reduz o volume para 10% da intensidade máxima
    backgroundMusic.loop(); // Toca a música em loop
  }
}

// Função para criar partículas
function createParticles(x, y) {
  particles.push(new Particle(x, y, 'normal'));
}

// Função para gerar partículas de choque
function generateShockParticles(x, y) {
  for (let i = 0; i < 1; i++) {
    particles.push(new Particle(x, y + 400, 'shock'));
  }
}

// Classe de partículas
class Particle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.size = type === 'shock' ? random(10, 15) : random(5, 10);
    this.speedX = type === 'shock' ? random(-5, 5) : random(-3, 3);
    this.speedY = type === 'shock' ? random(-5, 5) : random(-3, -5);
    this.type = type;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 5; // Gradualmente desaparece
  }

  display() {
    if (this.type === 'shock') {
      fill(0, 255, 255, this.alpha); // Partículas de choque com cor ciano
      stroke(255, 255, 0, this.alpha); // Bordas brilhantes amarelas
      line(this.x, this.y, this.x + random(-10, 10), this.y + random(-10, 10)); // Linha elétrica
      strokeWeight(3);
    } else {
      fill(0, 172, 238, this.alpha);
      noStroke();
      ellipse(this.x, this.y, this.size);

      fill(255, this.alpha);
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.size / 2, this.size / 4);
    }
  }
}
