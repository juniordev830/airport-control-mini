# Airport Control Mini

**Status:** primeiro MVP gráfico para navegador. É um **jogo fictício**, não um sistema operacional de tráfego aéreo.

## O que faz
- Radar 2D, pistas e aviões com trajetórias de aproximação.
- Clique ou toque em um avião amarelo para conceder autorização de pouso (vira verde).
- Acompanhe pousos, voos em aproximação e tentativas sem autorização.
- O desafio é completar 8 pousos antes de acumular 3 incidentes.
- Pressione **R** para reiniciar.

## Tecnologias
TypeScript, Phaser 3, Vite; regras de cálculo separadas do motor gráfico com testes Node.

## Executar
Requer Node.js 20.19+:

```bash
npm install
npm run dev
```

## Validar
```bash
npm test
npm run build
```

Os testes verificam movimento, distância, autorização e condições de vitória/derrota.

## Limites
Este protótipo usa gráficos geométricos, trajetórias simplificadas e dados simulados. Ainda não possui física aérea real, separação vertical, áudio, persistência ou gerenciamento de múltiplas pistas. Não use para decisões reais sobre aviação.

## Próximas melhorias
- Curvas de aproximação e múltiplas rotas;
- efeitos sonoros, missões e dificuldade escalável;
- controles mais detalhados e melhorias de acessibilidade.


## Sistema de pontuação (novo)

O radar agora mostra a pontuação e a sequência de pousos bem-sucedidos. Cada pouso autorizado rende **100 pontos** mais **25 por pouso consecutivo adicional**, limitado ao bônus de cinco pousos seguidos (máximo de 200 pontos por pouso). Um voo não autorizado subtrai 60 pontos (sem deixar a pontuação negativa) e reinicia a sequência.

As regras estão em `src/scoring.ts`, isoladas do Phaser, com testes `tests/scoring.test.mjs` cobrindo sequência, reinicialização, limites e não mutação do estado. Pressione **R** para começar uma nova partida com o placar zerado.

Esses valores são mecânicas de um jogo fictício, não critérios reais de controle de tráfego aéreo.

## Priorização de pousos

O painel passa a indicar o **próximo voo sem autorização**, ordenado pela estimativa do tempo até entrar no círculo de pouso. A estimativa considera distância, velocidade constante do avião e raio de pouso; não representa controle real de tráfego aéreo. Todos os cálculos são testados em `tests/rules.test.mjs`.
