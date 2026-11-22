"""Verificações de tipos de entrada do agendador de pista."""
from datetime import datetime, timedelta
import unittest
from scheduler import Operation, RunwayScheduler


class InvalidInputsTest(unittest.TestCase):
    def setUp(self):
        self.start = datetime(2026, 11, 22, 10, 0)
        self.end = self.start + timedelta(minutes=30)

    def test_reject_non_string_flight_or_runway(self):
        for flight, runway in ((None, "A"), (123, "A"), ("JX1", None), ("JX1", 1)):
            with self.subTest(flight=flight, runway=runway), self.assertRaises(ValueError):
                Operation(flight, runway, "landing", self.start, self.end)

    def test_reject_non_string_operation_kind(self):
        with self.assertRaises(ValueError):
            Operation("JX1", "A", ["landing"], self.start, self.end)

    def test_scheduler_rejects_arbitrary_input_without_changing_state(self):
        scheduler = RunwayScheduler()
        for invalid in (None, 123, {"flight": "JX1"}):
            with self.subTest(invalid=invalid), self.assertRaises(TypeError):
                scheduler.schedule(invalid)
        self.assertEqual(scheduler.operations(), ())


if __name__ == "__main__":
    unittest.main()
