import unittest
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from scheduler import Operation, RunwayScheduler


class SchedulerTests(unittest.TestCase):
    def setUp(self):
        self.start = datetime(2026, 11, 11, 10, 0)
        self.scheduler = RunwayScheduler()

    def op(self, flight="AZ100", runway="01", offset=0, duration=10, kind="landing"):
        start = self.start + timedelta(minutes=offset)
        return Operation(flight, runway, kind, start, start + timedelta(minutes=duration))

    def test_overlapping_same_runway_rejected(self):
        self.scheduler.schedule(self.op())
        with self.assertRaisesRegex(ValueError, "occupied"):
            self.scheduler.schedule(self.op("AZ101", offset=5))

    def test_adjacent_operations_allowed(self):
        self.scheduler.schedule(self.op())
        self.scheduler.schedule(self.op("AZ101", offset=10))
        self.assertEqual(len(self.scheduler.operations()), 2)

    def test_parallel_runways_allowed(self):
        self.scheduler.schedule(self.op())
        self.scheduler.schedule(self.op("AZ101", runway="02"))
        self.assertEqual(len(self.scheduler.operations()), 2)

    def test_duplicate_flight_rejected(self):
        self.scheduler.schedule(self.op())
        with self.assertRaisesRegex(ValueError, "already scheduled"):
            self.scheduler.schedule(self.op(runway="02", offset=30))

    def test_invalid_duration_rejected(self):
        with self.assertRaises(ValueError):
            self.op(duration=0)

    def test_invalid_kind_rejected(self):
        with self.assertRaises(ValueError):
            self.op(kind="taxi")

    def test_filtered_operations(self):
        self.scheduler.schedule(self.op(runway="02"))
        self.scheduler.schedule(self.op("AZ101", runway="01"))
        self.assertEqual([o.flight for o in self.scheduler.operations("01")], ["AZ101"])

    def test_aware_operations_distinguish_repeated_local_times(self):
        zone = ZoneInfo("America/New_York")
        first = datetime(2026, 11, 1, 1, 30, tzinfo=zone, fold=0)
        second = first.replace(fold=1)
        self.scheduler.schedule(Operation("AZ100", "01", "landing", first, second))
        self.scheduler.schedule(Operation("AZ101", "01", "landing", second, second.replace(minute=40)))
        with self.assertRaisesRegex(ValueError, "occupied"):
            self.scheduler.schedule(Operation("AZ102", "01", "landing", first, first.replace(minute=40)))
        self.assertEqual([op.flight for op in self.scheduler.operations()], ["AZ100", "AZ101"])

    def test_schedule_rejects_mixed_time_zone_conventions(self):
        local = self.op()
        aware = self.start.replace(tzinfo=ZoneInfo("UTC"))
        with self.assertRaisesRegex(ValueError, "time zone convention"):
            Operation("AZ101", "01", "landing", local.start, aware + timedelta(minutes=20))
        self.scheduler.schedule(local)
        with self.assertRaisesRegex(ValueError, "time zone convention"):
            self.scheduler.schedule(Operation("AZ101", "02", "landing", aware, aware + timedelta(minutes=5)))
        self.assertEqual(self.scheduler.operations(), (local,))


if __name__ == "__main__":
    unittest.main()
