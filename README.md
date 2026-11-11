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
