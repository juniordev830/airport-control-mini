# Airport Control Mini

## Jogo de navegador em Phaser

**Status:** primeiro MVP gráfico para navegador. É um **jogo fictício**, não um sistema operacional de tráfego aéreo.

### O que faz
- Radar 2D, pistas e aviões com trajetórias de aproximação.
- Clique ou toque em um avião amarelo para conceder autorização de pouso (vira verde).
- Acompanhe pousos, voos em aproximação e tentativas sem autorização.
- O desafio é completar 8 pousos antes de acumular 3 incidentes.
- Pressione **R** para reiniciar.

### Tecnologias
TypeScript, Phaser 3, Vite; regras de cálculo separadas do motor gráfico com testes Node.

### Executar
Requer Node.js 20.19+:

```bash
npm install
npm run dev
```

### Validar
```bash
npm test
npm run build
```

Os testes verificam movimento, distância, autorização e condições de vitória/derrota.

### Limites
Este protótipo usa gráficos geométricos, trajetórias simplificadas e dados simulados. Ainda não possui física aérea real, separação vertical, áudio, persistência ou gerenciamento de múltiplas pistas. Não use para decisões reais sobre aviação.

### Próximas melhorias
- Curvas de aproximação e múltiplas rotas;
- efeitos sonoros, missões e dificuldade escalável;
- controles mais detalhados e melhorias de acessibilidade.


### Sistema de pontuação (novo)

O radar agora mostra a pontuação e a sequência de pousos bem-sucedidos. Cada pouso autorizado rende **100 pontos** mais **25 por pouso consecutivo adicional**, limitado ao bônus de cinco pousos seguidos (máximo de 200 pontos por pouso). Um voo não autorizado subtrai 60 pontos (sem deixar a pontuação negativa) e reinicia a sequência.

As regras estão em `src/scoring.ts`, isoladas do Phaser, com testes `tests/scoring.test.mjs` cobrindo sequência, reinicialização, limites e não mutação do estado. Pressione **R** para começar uma nova partida com o placar zerado.

Esses valores são mecânicas de um jogo fictício, não critérios reais de controle de tráfego aéreo.

### Priorização de pousos

O painel passa a indicar o **próximo voo sem autorização**, ordenado pela estimativa do tempo até entrar no círculo de pouso. A estimativa considera distância, velocidade constante do avião e raio de pouso; não representa controle real de tráfego aéreo. Todos os cálculos são testados em `tests/rules.test.mjs`.

## Agendamento e turnos em Python

Simulador de tráfego aéreo com controle de pousos, decolagens e pistas.

### Protótipo funcional (Python 3.10+)

O módulo `scheduler.py` agenda operações de pouso e decolagem com intervalos de ocupação por pista. Rejeita conflitos de horários na mesma pista, voos duplicados e operações inválidas. Intervalos consecutivos são permitidos, e pistas diferentes podem operar em paralelo.

Este é um núcleo em memória: não representa separação de segurança operacional, regras ATC reais nem persistência.

### Testes

```bash
python -m unittest discover -s tests -v
```

O conjunto de testes cobre conflitos, intervalos adjacentes, pistas paralelas, duplicação de voos, validação e consulta por pista.

### Incremento: turno de controle

Além do núcleo de agendamento, `turns.py` implementa fila de aeronaves fictícias, autorizações sem conflito, cancelamento de pedidos pendentes, relógio simulado e finalização de operações. O sistema usa tempos controlados, sem relógio real, e não deve ser utilizado para operações de aviação.

```bash
python turns.py
python -m unittest discover -s tests -p 'test_*.py' -v
```

O CI valida o núcleo Python com entradas e horários fictícios.

### O que ainda falta

O conceito original prevê interface 2D com visualização da pista e fila, controles interativos, pontuação, tutorial e build de demonstração. Essas etapas **ainda não estão implementadas**: o que funciona hoje é a simulação de domínio em Python com testes. Todos os voos são fictícios e o projeto não se destina a controle aéreo real.
