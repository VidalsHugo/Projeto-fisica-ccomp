let pontos = []; // Matriz de pontos na malha
let componentes = []; // Lista de componentes no circuito (pilhas, fios, resistores)
let circuito = []; // Matriz que representa o circuito
let componenteSelecionado = 'fio'; // Componente atualmente selecionado
let faseConcluida = false; // Indica se a fase foi concluída
let verificarButton; // Botão para verificar o circuito
const TAMANHO_MALHA = 4; // Tamanho da malha 4x4
const ESPACO_ENTRE_PONTOS = 100; // Espaço entre pontos na malha

function setup() {
  createCanvas(800, 600);
  criarMalha();
  inicializarCircuito();
  
  // Criar o botão de verificação
  verificarButton = createButton('Verificar Circuito');
  verificarButton.position(50, 300);
  verificarButton.mousePressed(verificarCircuito);
}

function draw() {
  background(240);
  desenharCircuito();
  desenharComponentes();

  // Se a fase estiver concluída, exibe a mensagem
  if (faseConcluida) {
    fill(0, 255, 0); // Cor verde para a mensagem
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Fase Concluída!", width / 2, height / 2);
  }
}

// Função para criar a malha de pontos (matriz 2D)
function criarMalha() {
  let offsetX = width / 2 - (TAMANHO_MALHA - 1) * ESPACO_ENTRE_PONTOS / 2;
  let offsetY = height / 2 - (TAMANHO_MALHA - 1) * ESPACO_ENTRE_PONTOS / 2;

  // Cria uma matriz de pontos 2D
  for (let i = 0; i < TAMANHO_MALHA; i++) {
    pontos[i] = []; // Inicializa a linha i
    for (let j = 0; j < TAMANHO_MALHA; j++) {
      pontos[i][j] = {
        x: offsetX + i * ESPACO_ENTRE_PONTOS,
        y: offsetY + j * ESPACO_ENTRE_PONTOS,
        selecionado: false,
        tipo: 0 // Inicialmente todos os pontos são vazios
      };
    }
  }
}

// Inicializa a matriz do circuito com os componentes faltando
function inicializarCircuito() {
  // Inicializa a matriz do circuito com valores vazios
  circuito = [
    [1, 0, 1, 0],
    [0, 0, 0, 0],
    [1, 0, 1, 0],
    [0, 0, 0, 0]
  ];
  
  // Aloca os pontos e seus tipos na malha (de acordo com a matriz do circuito)
  for (let i = 0; i < TAMANHO_MALHA; i++) {
    for (let j = 0; j < TAMANHO_MALHA; j++) {
      pontos[i][j].tipo = circuito[i][j];
    }
  }
}

// Função para desenhar o circuito
function desenharCircuito() {
  for (let i = 0; i < TAMANHO_MALHA; i++) {
    for (let j = 0; j < TAMANHO_MALHA; j++) {
      fill(255);
      if (pontos[i][j].tipo === 1) {
        fill(0); // Fio
      } else if (pontos[i][j].tipo === 2) {
        fill(255, 0, 0); // Pilha (bateria)
      } else if (pontos[i][j].tipo === 3) {
        fill(0, 0, 255); // Resistor
      }
      ellipse(pontos[i][j].x, pontos[i][j].y, 20); // Desenha o ponto
    }
  }
}

// Função para desenhar os ícones dos componentes no canto da tela
function desenharComponentes() {
  // Ícones dos componentes
  fill(0, 0, 255);
  rectMode(CENTER);
  rect(50, 50, 20, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Resistor", 50, 70);

  fill(255, 0, 0);
  rectMode(CENTER);
  rect(50, 120, 10, 20);
  fill(0);
  text("Pilha", 50, 140);

  fill(0);
  rectMode(CENTER);
  rect(50, 190, 20, 5);
  fill(0);
  text("Fio", 50, 210);
}

// Função para selecionar pontos e criar conexões
function mousePressed() {
  if (faseConcluida) return;

  // Verificar se clicou em um componente
  if (dist(mouseX, mouseY, 50, 50) < 20) {
    componenteSelecionado = 'resistor';
    return;
  } else if (dist(mouseX, mouseY, 50, 120) < 20) {
    componenteSelecionado = 'pilha';
    return;
  } else if (dist(mouseX, mouseY, 50, 190) < 20) {
    componenteSelecionado = 'fio';
    return;
  }

  let pontoClicado = null;

  // Verificar qual ponto foi clicado
  for (let i = 0; i < TAMANHO_MALHA; i++) {
    for (let j = 0; j < TAMANHO_MALHA; j++) {
      let d = dist(mouseX, mouseY, pontos[i][j].x, pontos[i][j].y);
      if (d < 10) {
        pontoClicado = pontos[i][j];
        break;
      }
    }
    if (pontoClicado) break;
  }

  // Se clicou em um ponto
  if (pontoClicado) {
    if (pontoClicado.tipo === 0) {
      // Alterar o tipo do ponto selecionado com o componente
      if (componenteSelecionado === 'resistor') {
        pontoClicado.tipo = 3; // Coloca um resistor
      } else if (componenteSelecionado === 'pilha') {
        pontoClicado.tipo = 2; // Coloca uma pilha
      } else if (componenteSelecionado === 'fio') {
        pontoClicado.tipo = 1; // Coloca um fio
      }
    }
  }
}

// Função para verificar se o circuito corresponde ao objetivo
function verificarCircuito() {
  // Matriz objetivo
  let objetivo = [
    [1, 2, 1, 0],
    [3, 3, 3, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0]
  ];

  // Imprime as duas matrizes no console para comparação
  console.log("Matriz objetivo:");
  for (let i = 0; i < TAMANHO_MALHA; i++) {
    console.log(objetivo[i]);
  }
  
  console.log("Matriz pontos:");
  for (let i = 0; i < TAMANHO_MALHA; i++) {
    let linha = [];
    for (let j = 0; j < TAMANHO_MALHA; j++) {
      linha.push(pontos[i][j].tipo);
    }
    console.log(linha);
  }

  // Verificar se a matriz do circuito é igual à matriz objetivo
  let completo = true;
  for (let i = 0; i < TAMANHO_MALHA; i++) {
    for (let j = 0; j < TAMANHO_MALHA; j++) {
      // Comparando cada valor da matriz com o tipo de cada ponto
      if (objetivo[i][j] !== pontos[i][j].tipo) {
        completo = false;
        break;
      }
    }
    if (!completo) break; // Para de verificar quando encontra um erro
  }

  if (completo) {
    faseConcluida = true; // Se o circuito estiver correto, a fase é concluída
  } else {
    alert("O circuito está incorreto. Tente novamente!");
  }
}