"""Minimal airport runway scheduler with conflict detection.

Run: python -m unittest discover -s tests -v
"""
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Operation:
    flight: str
    runway: str
    kind: str
    start: datetime
    end: datetime

    def __post_init__(self):
        if not self.flight.strip() or not self.runway.strip():
            raise ValueError("Flight and runway are required")
        if self.kind not in {"landing", "takeoff"}:
            raise ValueError("Operation must be landing or takeoff")
        if self.start >= self.end:
            raise ValueError("End must be later than start")


class RunwayScheduler:
    def __init__(self):
        self._operations: list[Operation] = []

    def schedule(self, operation: Operation) -> None:
        for existing in self._operations:
            if existing.flight == operation.flight:
                raise ValueError("Flight already scheduled")
            if (existing.runway == operation.runway
                    and operation.start < existing.end
                    and existing.start < operation.end):
                raise ValueError("Runway is occupied")
        self._operations.append(operation)

    def operations(self, runway: str | None = None) -> tuple[Operation, ...]:
        selected = (op for op in self._operations
                    if runway is None or op.runway == runway)
        return tuple(sorted(selected, key=lambda op: (op.start, op.flight)))
