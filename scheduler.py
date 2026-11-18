"""Minimal airport runway scheduler with conflict detection.

Run: python -m unittest discover -s tests -v
"""
from dataclasses import dataclass
from datetime import datetime, timezone


def timeline(instant: datetime) -> datetime:
    if instant.utcoffset() is None:
        return instant
    return instant.astimezone(timezone.utc)


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
        if not isinstance(self.start, datetime) or not isinstance(self.end, datetime):
            raise ValueError("Start and end must be date-times")
        start, end = timeline(self.start), timeline(self.end)
        if (start.utcoffset() is None) != (end.utcoffset() is None):
            raise ValueError("Start and end must use the same time zone convention")
        if start >= end:
            raise ValueError("End must be later than start")


class RunwayScheduler:
    def __init__(self):
        self._operations: list[Operation] = []

    def schedule(self, operation: Operation) -> None:
        start, end = timeline(operation.start), timeline(operation.end)
        if self._operations and (start.utcoffset() is None) != (self._operations[0].start.utcoffset() is None):
            raise ValueError("Use the same time zone convention for the entire schedule")
        for existing in self._operations:
            if existing.flight == operation.flight:
                raise ValueError("Flight already scheduled")
            if (existing.runway == operation.runway
                    and start < timeline(existing.end)
                    and timeline(existing.start) < end):
                raise ValueError("Runway is occupied")
        self._operations.append(operation)

    def operations(self, runway: str | None = None) -> tuple[Operation, ...]:
        selected = (op for op in self._operations
                    if runway is None or op.runway == runway)
        return tuple(sorted(selected, key=lambda op: (timeline(op.start), op.flight)))
