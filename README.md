# Airport Control Mini

Simulador **planejado** de controle de pistas, pousos e decolagens em um pequeno aeroporto fictício.

> **Estado na branch principal:** somente conceito documentado; o núcleo de código de outro PR ainda não foi integrado. O objetivo abaixo é um MVP futuro, não uma versão jogável.

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

- [ ] Domínio de pista, aeronave e agenda em memória, para pista única.
- [ ] Testes de conflito, estados e avanço de tempo.
- [ ] Interface 2D com visão simplificada da pista.
- [ ] Controles, pontuação e tutorial.
- [ ] Build de demonstração e instruções reproduzíveis.

Usar somente nomes, pistas e dados fictícios; não sugerir uso para controle de tráfego aéreo real.
