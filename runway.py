"""Conflict-free runway scheduling prototype (times in integer minutes)."""
from dataclasses import dataclass, field

@dataclass(frozen=True)
class Operation:
    flight: str
    kind: str
    start: int
    duration: int

    def __post_init__(self):
        if not self.flight or self.kind not in ("landing", "takeoff"):
            raise ValueError("Invalid flight or operation")
        if self.start < 0 or self.duration <= 0:
            raise ValueError("Invalid time")

    @property
    def end(self) -> int:
        return self.start + self.duration

@dataclass
class Runway:
    name: str
    operations: list[Operation] = field(default_factory=list)

    def schedule(self, operation: Operation, separation: int = 2) -> None:
        if separation < 0:
            raise ValueError("Separation must be nonnegative")
        if any(o.flight == operation.flight for o in self.operations):
            raise ValueError("Flight already scheduled")
        if any(operation.start < o.end + separation and o.start < operation.end + separation
               for o in self.operations):
            raise ValueError("Runway conflict")
        self.operations.append(operation)
        self.operations.sort(key=lambda o: o.start)

    def next_available(self, after: int, duration: int, separation: int = 2) -> int:
        if after < 0 or duration <= 0 or separation < 0:
            raise ValueError("Invalid scheduling parameters")
        candidate = after
        for op in sorted(self.operations, key=lambda o: o.start):
            if candidate + duration + separation <= op.start:
                break
            if candidate < op.end + separation:
                candidate = op.end + separation
        return candidate
