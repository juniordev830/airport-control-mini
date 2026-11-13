# Airport Control Mini

Simulador de tráfego aéreo com controle de pousos, decolagens e pistas.

## Protótipo funcional (Python 3.10+)

O módulo `scheduler.py` agenda operações de pouso e decolagem com intervalos de ocupação por pista. Rejeita conflitos de horários na mesma pista, voos duplicados e operações inválidas. Intervalos consecutivos são permitidos, e pistas diferentes podem operar em paralelo.

Este é um núcleo em memória: não representa separação de segurança operacional, regras ATC reais nem persistência.

## Testes

```bash
python -m unittest discover -s tests -v
```

O conjunto de testes cobre conflitos, intervalos adjacentes, pistas paralelas, duplicação de voos, validação e consulta por pista.

## Incremento: turno de controle (em revisão)

Além do núcleo de agendamento, `turns.py` implementa fila de aeronaves fictícias, autorizações sem conflito, cancelamento de pedidos pendentes, relógio simulado e finalização de operações. O sistema usa tempos controlados, sem relógio real, e não deve ser utilizado para operações de aviação.

```bash
python turns.py
python -m unittest discover -s tests -p 'test_*.py' -v
```

A interface gráfica ainda está pendente. O CI valida esse fluxo com entradas e horários fictícios.
