import unittest
from datetime import datetime
from turns import AirportGame


class AirportGameTests(unittest.TestCase):
    def setUp(self):
        self.game = AirportGame(datetime(2026, 1, 1, 8))
        self.game.request("AB-1", "landing", 5)
        self.game.request("CD-2", "takeoff", 4)

    def test_runway_conflict_and_completion(self):
        first = self.game.authorize("AB-1")
        with self.assertRaises(ValueError):
            self.game.authorize("CD-2")
        self.game.advance(4)
        self.assertEqual(self.game.active, "AB-1")
        self.game.advance(1)
        self.assertEqual(self.game.flights["AB-1"].status, "completed")
        second = self.game.authorize("CD-2")
        self.assertGreaterEqual(second.start, first.end)

    def test_cancel_only_pending(self):
        self.game.cancel("CD-2")
        with self.assertRaises(ValueError):
            self.game.authorize("CD-2")
        self.game.authorize("AB-1")
        with self.assertRaises(ValueError):
            self.game.cancel("AB-1")
        self.assertEqual(self.game.active, "AB-1")

    def test_reject_duplicates_and_invalid_duration(self):
        with self.assertRaises(ValueError):
            self.game.request("AB-1", "landing")
        with self.assertRaises(ValueError):
            self.game.request("ZZ", "takeoff", -1)
        with self.assertRaises(ValueError):
            self.game.advance(0)
        self.assertEqual(len(self.game.waiting()), 2)

    def test_clock_is_controlled(self):
        a = AirportGame(datetime(2026, 1, 1, 8))
        b = AirportGame(datetime(2026, 1, 1, 8))
        for g in (a, b):
            g.request("AA", "landing", 5)
            g.authorize("AA")
            g.advance(5)
        self.assertEqual(a.clock, b.clock)
        self.assertEqual(a.completed, b.completed)


if __name__ == "__main__":
    unittest.main()
