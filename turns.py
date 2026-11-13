"""Simulated single-runway game loop built on the conflict-safe scheduler."""
from dataclasses import dataclass
from datetime import datetime, timedelta

from scheduler import Operation, RunwayScheduler


@dataclass
class Flight:
    name: str
    kind: str
    duration: int
    status: str = "waiting"


class AirportGame:
    def __init__(self, start: datetime):
        if not isinstance(start, datetime):
            raise ValueError("start must be a datetime")
        self.clock = start
        self.scheduler = RunwayScheduler()
        self.flights: dict[str, Flight] = {}
        self.active: str | None = None
        self.completed: list[str] = []

    def request(self, name: str, kind: str, duration: int = 5):
        if not isinstance(name, str) or not name.strip() or len(name) > 30:
            raise ValueError("invalid flight name")
        if name in self.flights or kind not in ("landing", "takeoff"):
            raise ValueError("invalid flight or duplicate")
        if type(duration) is not int or not 1 <= duration <= 120:
            raise ValueError("duration must be 1..120 minutes")
        self.flights[name] = Flight(name, kind, duration)

    def authorize(self, name: str):
        flight = self.flights.get(name)
        if flight is None or flight.status != "waiting":
            raise ValueError("unknown or unavailable flight")
        if self.active is not None:
            raise ValueError("runway occupied")
        op = Operation(flight.name, "RWY-1", flight.kind,
                       self.clock, self.clock + timedelta(minutes=flight.duration))
        self.scheduler.schedule(op)
        flight.status = "authorized"
        self.active = name
        return op

    def cancel(self, name: str):
        flight = self.flights.get(name)
        if flight is None or flight.status != "waiting":
            raise ValueError("only waiting flights can be cancelled")
        flight.status = "cancelled"

    def advance(self, minutes: int = 1):
        if type(minutes) is not int or not 1 <= minutes <= 120:
            raise ValueError("invalid time advance")
        self.clock += timedelta(minutes=minutes)
        if self.active is None:
            return
        name = self.active
        operation = next(op for op in self.scheduler.operations() if op.flight == name)
        if self.clock >= operation.end:
            self.flights[name].status = "completed"
            self.completed.append(name)
            self.active = None

    def waiting(self):
        return tuple(f.name for f in self.flights.values() if f.status == "waiting")


if __name__ == "__main__":
    game = AirportGame(datetime(2026, 1, 1, 8))
    game.request("TST-1", "landing", 5)
    game.request("TST-2", "takeoff", 4)
    game.authorize("TST-1")
    game.advance(5)
    game.authorize("TST-2")
    print("Completed operations:", game.completed)
