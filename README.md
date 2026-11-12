# Airport Control Mini

Simulador **planejado** de controle de pistas, pousos e decolagens em um pequeno aeroporto fictício.

> **Estado nesta branch:** motor de regras em JavaScript com testes automatizados e demonstração no terminal. Ainda não existe interface jogável, mapa visual ou procedimentos operacionais reais.

## Escopo de um primeiro turno

Simular uma pista e aeronaves abstratas com solicitações de pouso/decolagem. O jogador decide qual operação autorizar, tentando evitar conflitos e atrasos. Não é um simulador de procedimentos reais de aviação.

## Regras propostas

- Uma pista só pode atender uma operação por vez.
- Uma aeronave autorizada ocupa a pista por um intervalo definido.
- Autorizações conflitantes devem ser recusadas sem alterar o estado.
- Cada aeronave possui estado: aguardando, autorizada, concluída ou cancelada.
- A passagem do tempo deve ser reproduzível em testes.

## Critérios de aceitação

1. Duas aeronaves disputam a mesma pista; apenas uma recebe autorização.
2. Após a primeira operação finalizar, a segunda pode ser atendida.
3. A interface mostra fila, pista ocupada e operações realizadas.
4. Cancelar pedido pendente não interrompe operação de outra aeronave.
5. Simulação não depende do relógio real do computador nos testes.

## Entregas

- [x] Domínio de pista, aeronave e agenda em memória, para pista única.
- [x] Testes de conflito, estados e avanço de tempo.
- [ ] Interface 2D com visão simplificada da pista.
- [ ] Controles, pontuação e tutorial.
- [ ] Build de demonstração e instruções reproduzíveis.

Usar somente nomes, pistas e dados fictícios; não sugerir uso para controle de tráfego aéreo real.

## Protótipo de regras já implementado

O arquivo `src/controle.js` permite solicitar, autorizar, concluir e cancelar operações fictícias de pouso ou decolagem em **uma única pista**. Operações simultâneas são rejeitadas enquanto a pista estiver ocupada. O estado anterior não é modificado.

Usar Node.js 20+:

```bash
npm test
npm run demo
```

O teste automatizado no GitHub Actions usa `.github/workflows/airport-tests.yml`. Este código serve somente para um jogo de lógica: não modela separação de aeronaves, meteorologia, procedimentos reais de controle de tráfego ou requisitos de segurança da aviação. A interface 2D ainda é planejada.
