# Engenharia reversa e estudo — Airport Control Mini

## Objetivo e fluxo

Minijogo de aproximação e coordenação de pousos. main.ts liga o cenário e as aeronaves simuladas. rules.ts e scoring.ts mantêm regras separadas do desenho, e scheduler.py oferece uma simulação de agenda.

**Tecnologias identificadas** · TypeScript, Python, Vite, Node.js, Phaser.

**Revisão de referência** · `094fdcf6c4b2`.

## Mapa do código

| Caminho | Papel de leitura | Símbolos selecionados |
| --- | --- | --- |
| [scheduler.py](../scheduler.py) | Implementação | `timeline`, `Operation`, `Operation.__post_init__`, `RunwayScheduler`, `RunwayScheduler.schedule`, `RunwayScheduler.operations` |
| [src/main.ts](../src/main.ts) | Ponto de leitura para entrada ou composição | `AirportScene`, `drawBackground`, `spawnAircraft`, `refresh` |
| [src/rules.ts](../src/rules.ts) | Implementação | `distance`, `moveToward`, `withinRadius`, `landingResult`, `missionState`, `estimatedArrivalSeconds` |
| [src/scoring.ts](../src/scoring.ts) | Implementação | `initialScore`, `scoreEvent` |
| [turns.py](../turns.py) | Implementação | `Flight`, `AirportGame`, `AirportGame.request`, `AirportGame.authorize`, `AirportGame.cancel`, `AirportGame.advance`, `AirportGame.waiting` |
| [index.html](../index.html) | Marcação ou estilos da interface | — |
| [src/style.css](../src/style.css) | Marcação ou estilos da interface | — |

## Configuração e referências

Ambiente e dependências: [package.json](../package.json).

## Roteiro de estudo e desenvolvimento

1. Comece pelo fluxo descrito acima e localize seus pontos de entrada no mapa. Acompanhe uma entrada válida até a transformação ou a resposta.
2. Abra um teste relacionado ao fluxo e descreva qual regra ele protege. Compare o tratamento esperado para entradas válidas, inválidas e nos limites.
3. Ao adicionar uma regra, determine qual módulo controla o dado e cubra o caso nesse nível. Em seguida, confira o efeito no comando, na API ou na interface de entrada.

**Pergunta de entrevista**

Como exercitar pontuação e separação de aeronaves sem iniciar um navegador?

## Testes versionados

Arquivos para começar a leitura dos cenários de teste: [tests/rules.test.mjs](../tests/rules.test.mjs), [tests/scoring.test.mjs](../tests/scoring.test.mjs), [tests/test_invalid_inputs.py](../tests/test_invalid_inputs.py), [tests/test_scheduler.py](../tests/test_scheduler.py), [tests/test_turns.py](../tests/test_turns.py).

Os comandos e versões de runtime usados no CI ficam em [.github/workflows/ci.yml](../.github/workflows/ci.yml), [.github/workflows/phaser-simulator.yml](../.github/workflows/phaser-simulator.yml).

[Voltar ao README](../README.md).
